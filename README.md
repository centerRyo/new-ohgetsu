# ohgetsu

ohgetsu(オオゲツ)はアレルギーを持つ人たちがレストランに行く前に自分の食べれるメニューがあるかを検索できるサービスになります。

https://ohgetsu.com/

# demo

TODO: ここに動画を載せる

# Requirement

- Node.js v20.2.0
- Docker v20.10.21
- npm v9.6.6

# Installation

## git clone

```
$ git clone git@github.com:centerRyo/new-ohgetsu.git
```

## docker compose up

```
$ docker compose up -d
```

## npm i

### for web

```
$ cd web/
$ npm i
```

### for server

```
$ cd server/
$ npm i
```

## copy env

### for web

.env をコピーして、.env.local を作成する。

env の値は適宜書き換える。

### for server

.env.sample をコピーして、.env.local を作成する。

env の値は適宜書き換える。

## db migration

```
$ cd server/prisma
$ npx prisma migrate dev
```

## insert seed data

```
$ cd server/
$ npx prisma db seed
```

## access page

### for web

```
$ cd web/
$ npm run dev:next
```

http://localhost:3000

### for server(swagger)

```
$ cd server/
$ npm run start:dev
```

http://localhost:8080/api

# Structure of this project

```
/new-ohgetsu
│
├── nginx # proxyサーバー(本番環境用)
│
├── server # バックエンド
│
├── web # フロントエンド
```

# For each directory

[web の README](/web/README.md)を参照

[server の README](/server/README.md)を参照
