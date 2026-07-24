# 海外のアレルギー関連サービスと、そのビジネスモデル

> 日本以外で「収益を上げている」アレルギー関連の事業を4領域で調査し、ohgetsu(アレルギー対応レストラン検索)が日本で取り入れられる勝ち筋を整理したレポート。

| 項目 | 内容 |
|---|---|
| 調査手法 | Web横断調査 + 各主張の敵対的検証(25ソース・83主張抽出 → 25主張を検証し全て確認、棄却0) |
| 対象領域 | ①外食検索 / ②食品EC・D2C / ③医療・検査 / ④スキャン・成分API |
| 作成 | 2026-07-06 |

---

## 要旨 — 儲かっているのは「検索サービスそのもの」より“食品”と“成分データ”

4領域を調べた結論はシンプルです。ohgetsuのような **レストラン検索アプリ単体で大きく稼いでいる企業は世界的にも見当たりません**。米最大手の **AllergyEats** ですら単独では買収され、いまは消滅しました。一方で、明確に収益化に成功しているのは次の3タイプです。

- **会員制の食品EC(Thrive Market)** — 年会費モデルで **年商700億円超・黒字化**。アレルギー/ダイエット対応を「検索軸」にした食のD2C。
- **成分スキャンアプリ(Yuka)** — 広告ゼロ・サブスクのみで **ほぼ自己資金経営のまま数億円規模の売上**。
- **成分・アレルゲン判定API(Edamam)** — 開発者向け **SaaS(月 $14〜$299)**。検索アプリの「裏側」を売る。

逆に、**医薬(経口免疫療法 / OIT)は巨額の資本が必要で、ネスレでさえ撤退**した領域です。ohgetsuの現実的な勝ち筋は「検索を入口に、食品ECか成分データ提供へ横展開する」ことにあります。

---

## 01. 外食・レストラン検索 — 検索は「集客手段」であって「収益源」ではない

この領域は ohgetsu と最も近い。しかし調査の最大の学びは、**純粋な検索アプリは単独では収益化が難しい**という点です。

### AllergyEats(米国・2010年創業)— B2B2C フリーミアム

消費者向けは無料。Yelp型の **クラウドソース評価**(「どれだけアレルギー対応してくれたか」を3問で採点)+ OpenTable予約連携。収益は **飲食店が払う有料掲載枠**(バナー広告ではない)。全米3,000万人のアレルギー人口が対象。創業者 Paul Antico は3人の子どもが食物アレルギー。

| 指標 | 値 |
|---|---|
| 掲載レストラン数 | 850,000+ |
| ステータス | 2022年11月に Sirved が買収 → 本体統合で消滅 |
| 売上・取得額 | 非開示 |

> **ohgetsuへの示唆:** モデルは ohgetsu とほぼ同じ。だが13年運営しても単独EXITできず、買収後は本体に統合され消滅。**「店舗有料掲載」だけでは天井が低い**ことの実例。年間ランキング(全米で最もアレルギー対応が良い10チェーン)を **PR資産** にした点は真似る価値あり。

### OpenTable / Resy — 店舗向け SaaS / 従量課金(隣接モデル)

アレルギー専業ではないが「予約」で店舗課金する隣接モデル。

- **OpenTable**: 1予約あたり課金(月400席規模で約 $800〜1,600)。Booking Holdings 傘下、3,000万人。
- **Resy**: 定額SaaS(月 $349〜$499)。American Express 傘下、1,000万人。

> **ohgetsuへの示唆:** 検索の先に **「アレルギー配慮予約」** を差し込めれば、店舗から予約手数料/定額が取れる。予約という具体的な取引が発生して初めて店舗は継続課金する。

### 【日本の競合】Allergy Connect(アレルギーコネクト / 運営:fuseful)

2023年8月にほぼ同じコンセプトで登場。マップ・店名・アレルゲン別に検索でき、2024年2月時点で口コミ経由の **約800ユーザー**。クラウドソース型で「店に直接確認を」と注意書き。**マネタイズは未確立(無料アプリ)**。

→ 日本の外食検索セグメントはまだ「収益前」の空白地帯で、先行者利益を取りに行ける段階。

---

## 02. 食品EC・D2C・サブスク — いちばん儲かっている領域

4領域で最も明確に黒字・大型化しているのがここ。ohgetsuが持つ「アレルギー×食」の文脈と最も相性が良い。

### Thrive Market(米国・2014年創業)— 会員制サブスク EC

Costco型の **年会費モデル(年 $59.95 / 月 $12)** でオーガニック/健康食品を割引販売。**90以上の食事・体質属性(グルテンフリー、Non-GMO 等)で商品を絞り込める** — これはまさに ohgetsu のアレルゲン絞り込みと同じUX。

| 指標 | 値 |
|---|---|
| 年商(2025/3) | $700M+ |
| 有料会員数 | 1.6M+ |
| 収益性 | 初の通期黒字を達成(2024) |
| 累計調達額 | $241M+(Series B $111M を含む) |

> **ohgetsuへの示唆:** **「体質・アレルギーで絞り込む → 買える」** が年商700億円の黒字事業になる、という最有力の証明。検索で終わらず **会員課金 + 物販** へ橋渡しする設計が鍵。

### Partake Foods(米国・2016年創業)— アレルゲンフリー D2C / CPG

創業者は **娘が複数の食物アレルギーと診断された元コカ・コーラ幹部**(founder-market-fit)。上位9大アレルゲン不使用の焼き菓子を、EC + マス小売で販売。サブスクではなく **物販中心**。

| 指標 | 値 |
|---|---|
| 累計調達額 | $19M(Series B $11.5M, 2022年10月) |
| 取扱店 | 9,000店(Target / Whole Foods / Walmart / Kroger) |
| 売上成長 | +200%(2020→2021)/ +100%(2021→2022) |

Jay-Z の Marcy Venture Partners、Rihanna、H.E.R. 等の著名投資家が参加。

> **ohgetsuへの示唆:** アレルゲンフリー食品は **ニッチではなくマス小売で棚を取れる** ことの証明。日本なら ohgetsu が **D2Cブランドの立ち上げ/共同開発の入口** になり得る。

---

## 03. 医療・検査・経口免疫療法(OIT)— 市場は巨大、ただし資本集約的

市場規模は魅力的だが、ここは **製薬・大手診断メーカーの土俵**。ohgetsuが直接参入する領域ではなく、「連携先」として理解しておく領域。

| 指標 | 値 |
|---|---|
| アレルギー診断市場 | $6.35B(2025)→ $12.0B(2031), CAGR 11.3% |
| 最速成長地域 | アジア太平洋(CAGR 13.75%) |
| 米国のアレルギー有病率 | 成人 31.8% / 小児 27.2% |

主要プレイヤーは Thermo Fisher Scientific、Danaher、Siemens Healthineers、BioMérieux 等の大手診断メーカー。

### 【要注意事例】Palforzia(Aimmune Therapeutics)— ピーナッツ OIT 薬

世界初のFDA承認ピーナッツアレルギー治療薬(2020年1月)。**ネスレが約 $2.1B(21億ドル)で買収** したが、患者・医師への普及が想定を下回り、**わずか3年で Stallergenes Greer へ売却(実質撤退)**。売上は予測($1.28B)に遠く及ばず。

| 指標 | 値 |
|---|---|
| Aimmune 純損失(2019単年) | -$248.5M |
| 累積赤字(承認前まで) | -$724.7M |
| ネスレ買収額 | $2.1B → 3年で撤退 |

> **警告:** 承認まで **数百億円の赤字を垂れ流す資本集約モデル**。ネスレほどの巨人でも収益化できなかった。**ohgetsuが手を出す領域ではない。**

### 【日本にとっての希望】

Aimmune が次に狙った **卵アレルギーは中国・日本に患者が集中**(日本では卵が最多アレルゲン、世界で600万人超)。→ 日本は「食物アレルギー医療」の需要が構造的に大きい。ohgetsuは **薬を作るのではなく、患者データ・受診導線・生活支援でクリニックやメーカーと組む** ポジションが現実的。

---

## 04. スキャンアプリ・成分データ API — 軽量で高収益

設備投資が要らず、ソフトだけで成立する領域。ohgetsuの技術資産(このリポジトリはすでに PDF からアレルゲンを抽出する機能を開発中)と最も地続き。

### Yuka(フランス・2016年創業)— サブスク(広告ゼロ)

食品・化粧品のバーコードを **スキャンして健康影響を採点**。広告もメーカー課金も一切なし、**Premiumサブスクのみ**(商品検索・オフライン・パーソナル通知を課金)。独立性の証明として BS・売上を公開。

| 指標 | 値 |
|---|---|
| 累計調達額 | 〜€800K(2019シード1回のみ) |
| 推定売上(2024, 外部推計) | $7.4M(※2023推計は $20.3M) |
| 社員数 | 約20名(超少人数経営) |

> **ohgetsuへの示唆:** **ほぼ自己資金・少人数のまま数億円規模** という、スタートアップに最も再現しやすいモデル。「広告に依存せず、ユーザー課金で独立を保つ」姿勢がブランド価値そのもの。
> ※ $7.4M / $20.3M は外部サイト(GetLatka)の推計値で振れ幅に注意。

### Edamam — 成分・栄養データ API(開発者向け SaaS)

食品データから **70種以上の食事/アレルゲン判定(Peanut Free 等)を自動生成**。**バーコード照合対応(70万UPC / 約90万食品、うち13万は外食チェーン品目)**。

| 指標 | 値 |
|---|---|
| 段階課金 | 月 $14(10万コール)〜 $299(500万コール)+ 無制限は個別見積り |
| 自動生成タグ | 70+(アレルゲン / 食事) |
| 収録食品数 | 約900,000(うちバーコード70万) |

> **ohgetsuへの示唆:** 検索アプリの「裏側の成分データ」を API として **他社に売る** B2Bモデル。ohgetsuが日本の外食メニュー×アレルゲンのデータを蓄積すれば、同様にAPI提供が可能。

### その他プレイヤー

- **Spoonful**(米・2018創業):低FODMAP等に強い。Precursor Ventures / Operate 出資。
- **Fig / foodisgood.com**:27以上の食事カテゴリ(Alpha-Gal・GERD・妊娠中対応まで細分化)、50店舗以上で照合。

この領域は競合多数(Yuka・Codecheck・GreenChoice が上位)で、差別化は **「地域データの独占」** が鍵。

---

## 05. 日本市場の前提・規制

- **法定アレルゲン表示制度がある** — 「特定原材料」(卵・乳・小麦・落花生・えび・かに・そば・くるみ・カシューナッツ 等)は **包装加工食品に表示義務**。「義務」+「推奨」の **2層構造** で、データ製品はこの両方をモデル化する必要がある。
- **制度は変わり続ける** — **カシューナッツは2026年4月1日に義務化**、マカダミアナッツは2024年3月に推奨追加(まつたけは削除)。消費者庁が約3年ごとの全国実態調査で見直すため、**データベースは継続メンテが前提**。
- **グルテンフリー市場は堅調成長** — 日本の GF 市場は CAGR 4.70%(2025-2030)。ただし大手(Nestlé, Kellogg's, General Mills, Hain Celestial, キユーピー系 Kibun 等)が寡占。2018年に **世界初の「ノングルテン」米粉認証制度** も登場。
- **「健康ハロー効果」で客層が広い** — 医療的必要がなくても GF = 健康的と捉える層が拡大し、**アレルギー患者を超えた購買層** がある。販路はスーパー / コンビニ / EC。

---

## 06. 結論 — ohgetsuの勝ち筋

**「検索を入口に、食品ECと成分APIへ横展開する」**

収益実態と日本応用の両面から、ohgetsuが取るべき優先順位:

| 優先度 | 施策 | 参照モデル | 要点 |
|---|---|---|---|
| ◎ 最優先 | **① 会員制の食品EC / D2Cへ橋渡し** | Thrive Market | 「絞り込む」を「絞り込んで買える」まで伸ばす。年会費 or 物販マージン。最も黒字化が実証されたモデル。日本のGF/アレルゲンフリー食品はブランドが弱く共同開発の余地大。 |
| ◎ 最優先 | **② 成分・アレルゲン判定データを API化** | Edamam | 開発中の PDF/メニューからのアレルゲン抽出を、日本の外食メニュー×特定原材料の独自DBに育て B2B提供。設備不要・高粗利。制度改定対応(2026年カシュー義務化等)が参入障壁=堀になる。 |
| ○ 検討 | **③ スキャンアプリ + ユーザー課金** | Yuka | 広告に頼らずサブスクで独立を保つ少人数モデル。日本の商品バーコード×特定原材料DBを作れば刺さる。競合多数、差別化は網羅性次第。 |
| ○ 検討 | **④ 店舗向け「アレルギー配慮予約」課金** | OpenTable / Resy | 検索の先に予約を差し込み店舗から手数料/定額。ただし掲載枠課金だけの AllergyEats は天井が低かった — 予約という取引まで作らないと継続課金しない。 |
| × 非推奨 | **⑤ 医薬・OIT・診断の自社開発** | Palforzia | 数百億円の赤字に耐える資本集約モデル。ネスレでさえ3年で撤退。作る側でなく、患者導線・生活支援でクリニック/メーカーと組む連携ポジションに徹する。 |

> **ひとことで:** ohgetsuの資産は「アレルギー当事者の信頼」と「アレルゲン×食のデータ」。これを **①買える場(EC)** と **②売れるデータ(API)** に変換するのが、海外の成功事例が示す最短の収益化ルート。

---

## 出典(検証済み)

| # | 内容 | ソース |
|---|---|---|
| 1 | Sirved acquires AllergyEats(一次) | [PR Newswire](https://www.prnewswire.com/news-releases/restaurant-discovery-platform-sirved-acquires-allergy-friendly-restaurant-guide-allergyeats-301664166.html) |
| 2 | AllergyEats 創業者/モデル | [MIT Alumni](https://alum.mit.edu/slice/letting-out-yelp-allergy-sufferers) |
| 3 | OpenTable vs Resy 料金 | [US Tech Automations](https://ustechautomations.com/resources/blog/automate-opentable-vs-resy-for-restaurants-2026) |
| 4 | Thrive Market 概況 | [Contrary Research](https://research.contrary.com/company/thrive-market) |
| 5 | Thrive Market 黒字化 | [Forbes](https://www.forbes.com/sites/dianebrady/2024/01/09/thrive-market-ceo-on-what-it-will-take-to-stay-profitable/) |
| 6 | Partake Foods Series B | [TechCrunch](https://techcrunch.com/2022/10/04/partake-foods-allergy-friendly-series-b/) / [vegconomist](https://vegconomist.com/food-and-beverage/sweets-snacks/partake-raises-11-5m-allergy-friendly-vegan-snacks/) |
| 7 | Nestlé × Palforzia 撤退 | [FiercePharma](https://www.fiercepharma.com/pharma/2b-and-3-years-later-nestle-ditches-aimmunes-peanut-allergy-drug-palforzia) |
| 8 | Aimmune 10-K(財務・一次) | [SEC EDGAR](https://www.sec.gov/Archives/edgar/data/1631650/000156459020007384/aimt-10k_20191231.htm) |
| 9 | アレルギー診断市場 | [Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/allergy-diagnostics-market) / [Towards Healthcare](https://www.towardshealthcare.com/insights/allergy-diagnostics-and-therapeutics-market) |
| 10 | Yuka 財務/資金 | [GetLatka](https://getlatka.com/companies/yuka.io) / [Yuka公式(一次)](https://help.yuka.io/l/en/article/zrgtb8f2ka-yuka-financing) |
| 11 | Edamam API(一次) | [Edamam Developer](https://developer.edamam.com/food-database-api) |
| 12 | Spoonful / Fig | [Tracxn](https://tracxn.com/d/companies/spoonful/__ALgHUL9nDCgb81vfEJWh4dixjLCMqbghhHEl_jFy2dg) / [foodisgood.com](https://foodisgood.com/) |
| 13 | 日本のアレルゲン表示制度(一次) | [消費者庁](https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/allergy/) |
| 14 | 日本 GF市場 | [Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/japan-gluten-free-foods-beverages-market-industry) |
| 15 | Allergy Connect(日本の競合) | [Forbes JAPAN](https://forbesjapan.com/articles/detail/68881) |

---

<sub>本レポートは Web 横断調査(25ソース・83主張抽出)と、各主張の敵対的検証(25主張を検証し全て確認、棄却0)に基づく。市場規模・売上の一部は調査会社/外部推計を含み、企業非開示の数値(AllergyEats の売上・買収額等)は「非開示」と明記。Yuka の売上($7.4M/$20.3M)は外部サイトの推計で振れ幅がある。数値は調査時点(2026年前半)のもの。</sub>
