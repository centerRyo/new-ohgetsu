# Let's Encrypt SSL 証明書の自動更新

本番の nginx リバースプロキシは、Gandi で購入した証明書から **Let's Encrypt（無料・自動更新）** に移行しました。
このドキュメントは、初回セットアップ手順と運用の考え方をまとめたものです。

## 構成の概要

- **証明書の発行/更新**: `certbot` コンテナが担当。HTTP-01（webroot）方式でドメイン所有を確認する。
- **TLS 終端**: `nginx-proxy` コンテナが担当。証明書を共有ボリュームから読む。
- **共有ボリューム**:
  - `letsencrypt` … 証明書本体（`/etc/letsencrypt`）
  - `certbot-webroot` … ACME チャレンジファイル（`/var/www/certbot`）
- nginx と certbot は Docker ソケットを介さず疎結合。certbot が証明書を更新すると共有ボリュームに書き込まれ、nginx は 6 時間ごとに自身の設定を reload して新しい証明書を読み直す。

証明書は **イメージに焼き込まない**。そのため証明書更新のたびに nginx イメージを再ビルドしたり、GitHub Secrets を差し替える必要はなくなった。

## 初回セットアップ（サーバー上で 1 回だけ）

Let's Encrypt の証明書がまだ存在しない状態では nginx は起動できないため、デプロイ前に **初回の証明書取得をサーバー上で手動実行**する。

初回取得は **standalone 方式**（certbot 自身が一時的に 80 番で待ち受けて検証）を使う。
現行の本番 nginx は 80 番をすべて HTTPS へリダイレクトしており webroot 方式では
チャレンジが 404 になるため、現行 nginx を数十秒〜1 分だけ停止して 80 番を空ける。

> **ダウンタイム**: この手順の間、現行 nginx を停止するため数十秒〜1 分程度サービスが
> 停止する。低トラフィックの時間帯に実施することを推奨する。

さくらクラウドのサーバーに SSH でログインし、以下を実行する。

```sh
DOMAIN=ohgetsu.com
EMAIL=<有効期限切れ通知を受け取るメールアドレス>

# 共有ボリュームを作成
docker volume create letsencrypt
docker volume create certbot-webroot

# --- ここからダウンタイム開始 ---
# 現行 nginx を停止して 80 番を空ける（削除ではなく停止。取得失敗時に戻せるように）
docker stop nginx-proxy

# standalone 方式で初回の証明書を取得（certbot が一時的に 80 番を使う）
docker run --rm \
  -p 80:80 \
  -v letsencrypt:/etc/letsencrypt \
  certbot/certbot certonly \
    --standalone \
    -d "$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos --no-eff-email

# 取得できたら現行 nginx を再開（新イメージのデプロイまでのつなぎ）
docker start nginx-proxy
# --- ここでダウンタイム終了 ---
```

`/etc/letsencrypt/live/ohgetsu.com/fullchain.pem` が生成されれば成功。
このあと PR をマージし、GitHub Actions の **Deploy Nginx Proxy and DB**（`workflow_dispatch`）を
実行すると、証明書を読む新しい本番 nginx と certbot（自動更新）コンテナが起動する。

> 補足: 発行検証がうまくいくか不安な場合は、上記 `certonly` に `--staging` を付けて
> Let's Encrypt のステージング環境で試すとレート制限を消費せずに確認できる。成功したら
> `--staging` を外して本番証明書を取得し直す（staging の証明書は `letsencrypt` ボリューム上に
> 残るので、本番取得前に `docker run --rm -v letsencrypt:/etc/letsencrypt certbot/certbot
> delete --cert-name "$DOMAIN"` で消しておく）。

## 自動更新の仕組み

- `certbot` コンテナが 12 時間ごとに `certbot renew` を実行する。
- 証明書の有効期限は 90 日。certbot は残り 30 日を切ったもののみ実際に更新するため、
  ほとんどの実行は no-op。
- 更新された証明書は `letsencrypt` ボリュームに書き込まれ、`nginx-proxy` が 6 時間ごとの
  reload で読み直す。

いずれのコンテナも `--restart unless-stopped` で起動するため、サーバー再起動後も自動復帰する。

## 運用上の注意

- **失効通知**: 初回取得時に指定したメールアドレスに、更新が滞った場合の警告が届く。有効なアドレスを設定すること。
- **レート制限**: Let's Encrypt には発行レート制限がある（同一ドメインで直近に何度も発行し直すと制限に達する）。検証は `--staging` を活用する。
- **旧 Secrets**: 移行完了後、GitHub の `SSL_CERT` / `SSL_KEY` Secrets は不要になる。Gandi の証明書更新も停止してよい。

## DB データの扱い（重要）

このワークフローは nginx と PostgreSQL をまとめて起動する。DB については以下の方針で保護している。

- **既に `ohgetsu-db` が稼働中ならコンテナには一切触れない**（誤って落とさない）。
- 新規起動時は永続化ボリューム `ohgetsu-db-store` を `/var/lib/postgresql/data` にマウントするため、
  以降はコンテナを作り直してもデータは残る。

> **移行時の注意**: この変更以前の本番 DB コンテナは**永続化ボリューム無しで起動**していた。
> そのため、稼働中の DB を新方式（ボリューム付き）に切り替える際は、コンテナを作り直すと
> **既存データが失われる**。切り替え前に必ず `pg_dump` でバックアップを取り、新ボリュームの
> コンテナ起動後に `pg_restore`（または `psql`）でリストアすること。無停止のまま放置していれば
> 上記ガードによりデータはそのまま維持される。


> 本手順内のレート制限・有効期間などの数値は変わり得るため、実運用の前に
> [Let's Encrypt 公式ドキュメント](https://letsencrypt.org/docs/) の一次情報で確認すること。
