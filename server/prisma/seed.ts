import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // genresの初期データを登録
  await prisma.genres.createMany({
    data: [
      {
        name: '日本料理',
      },
      {
        name: '海鮮',
      },
      {
        name: '天ぷら',
      },
      {
        name: '焼き鳥・串焼・鳥料理',
      },
      {
        name: 'しゃぶしゃぶ',
      },
      {
        name: 'お好み焼き・たこ焼き',
      },
      {
        name: 'おでん',
      },
      {
        name: 'うなぎ・あなご',
      },
      {
        name: 'とんかつ・揚げ物',
      },
      {
        name: 'そば',
      },
      {
        name: '麺類',
      },
      {
        name: 'どんぶり',
      },
      {
        name: '洋食',
      },
      {
        name: 'ステーキ・鉄板焼き',
      },
      {
        name: 'フレンチ',
      },
      {
        name: 'イタリアン',
      },
      {
        name: 'スペイン料理',
      },
      {
        name: 'ヨーロッパ料理',
      },
      {
        name: 'アメリカ料理',
      },
      {
        name: '中華料理',
      },
      {
        name: '四川料理',
      },
      {
        name: '台湾料理',
      },
      {
        name: '飲茶・点心',
      },
      {
        name: '餃子',
      },
      {
        name: '肉まん',
      },
      {
        name: '小籠包',
      },
      {
        name: '中華粥',
      },
      {
        name: 'アジア・エスニック',
      },
      {
        name: '韓国料理',
      },
      {
        name: '東南アジア料理',
      },
      {
        name: '南アジア料理',
      },
      {
        name: '中東料理',
      },
      {
        name: '中南米料理',
      },
      {
        name: 'アフリカ料理',
      },
      {
        name: 'カレー',
      },
      {
        name: 'インドカレー',
      },
      {
        name: 'スープカレー',
      },
      {
        name: '焼肉',
      },
      {
        name: 'ホルモン',
      },
      {
        name: 'ジンギスカン',
      },
      {
        name: '鍋',
      },
      {
        name: 'もつ鍋',
      },
      {
        name: '水炊き',
      },
      {
        name: 'ちゃんこ鍋',
      },
      {
        name: '火鍋',
      },
      {
        name: 'うどんすき',
      },
      {
        name: 'ダイニングバー',
      },
      {
        name: '立ち飲み',
      },
      {
        name: 'バル',
      },
      {
        name: 'ビアガーデン・ビアホール',
      },
      {
        name: 'ラーメン',
      },
      {
        name: 'つけ麺',
      },
      {
        name: '油そば・まぜそば',
      },
      {
        name: '台湾まぜそば',
      },
      {
        name: '坦々麺',
      },
      {
        name: '汁なし坦々麺',
      },
      {
        name: 'カフェ',
      },
      {
        name: '喫茶店',
      },
      {
        name: '甘味処',
      },
      {
        name: 'フルールパーラー',
      },
      {
        name: 'パンケーキ',
      },
      {
        name: 'コーヒースタンド',
      },
      {
        name: 'ティースタンド',
      },
      {
        name: 'ジューススタンド',
      },
      {
        name: 'タピオカ',
      },
      {
        name: 'スイーツ',
      },
      {
        name: '洋菓子',
      },
      {
        name: 'ケーキ',
      },
      {
        name: 'シュークリーム',
      },
      {
        name: 'チョコレート',
      },
      {
        name: 'ドーナツ',
      },
      {
        name: 'マカロン',
      },
      {
        name: 'バームクーヘン',
      },
      {
        name: 'プリン',
      },
      {
        name: 'クレープ・ガレット',
      },
      {
        name: '和菓子',
      },
      {
        name: '大福',
      },
      {
        name: 'たい焼き・大判焼き',
      },
      {
        name: 'どら焼き',
      },
      {
        name: 'カステラ',
      },
      {
        name: '焼き芋・大学芋',
      },
      {
        name: 'せんべい',
      },
      {
        name: '中華菓子',
      },
      {
        name: 'ジェラート・アイスクリーム',
      },
      {
        name: 'ソフトクリーム',
      },
      {
        name: 'かき氷',
      },
      {
        name: 'パン',
      },
      {
        name: 'サンドイッチ',
      },
      {
        name: 'ベーグル',
      },
      {
        name: 'バー',
      },
      {
        name: 'パブ',
      },
      {
        name: 'ワインバー',
      },
      {
        name: 'ビアバー',
      },
      {
        name: 'スポーツバー',
      },
      {
        name: '日本酒バー',
      },
      {
        name: '焼酎バー',
      },
      {
        name: '料理旅館',
      },
      {
        name: 'オーベルジュ',
      },
      {
        name: 'レストラン・食堂',
      },
      {
        name: '創作料理・イノベーティブ',
      },
      {
        name: 'オーガニック・薬膳',
      },
      {
        name: '弁当・おにぎり・惣菜',
      },
      {
        name: '肉料理',
      },
      {
        name: 'シーフード',
      },
      {
        name: 'サラダ・野菜料理',
      },
      {
        name: 'チーズ料理',
      },
      {
        name: 'にんにく料理',
      },
      {
        name: 'ビュッフェ',
      },
      {
        name: 'バーベキュー',
      },
      {
        name: '屋形船・クルージング',
      },
      {
        name: 'カラオケ',
      },
      {
        name: 'その他',
      },
    ],
  });

  // ingredientsの初期データを登録
  await prisma.ingredients.createMany({
    data: [
      {
        name: '卵',
        pic: '/image/ingredients/egg.png',
      },
      {
        name: '乳',
        pic: '/image/ingredients/milk.png',
      },
      {
        name: '小麦',
        pic: '/image/ingredients/wheat.png',
      },
      {
        name: 'そば',
        pic: '/image/ingredients/soba.png',
      },
      {
        name: 'えび',
        pic: '/image/ingredients/shrimp.png',
      },
      {
        name: 'かに',
        pic: '/image/ingredients/crab.png',
      },
      {
        name: 'アーモンド',
        pic: '/image/ingredients/almond.png',
      },
      {
        name: 'あわび',
        pic: '/image/ingredients/shell.png',
      },
      {
        name: 'いか',
        pic: '/image/ingredients/squid.png',
      },
      {
        name: 'いくら',
        pic: '/image/ingredients/salmon_roe.png',
      },
      {
        name: 'オレンジ',
        pic: '/image/ingredients/orange.png',
      },
      {
        name: 'カシューナッツ',
        pic: '/image/ingredients/cashew.png',
      },
      {
        name: 'キウイフルーツ',
        pic: '/image/ingredients/kiwi.png',
      },
      {
        name: '牛肉',
        pic: '/image/ingredients/cow.png',
      },
      {
        name: 'くるみ',
        pic: '/image/ingredients/walnut.png',
      },
      {
        name: 'ごま',
        pic: '/image/ingredients/sesame.png',
      },
      {
        name: 'さけ',
        pic: '/image/ingredients/salmon.png',
      },
      {
        name: 'さば',
        pic: '/image/ingredients/mackerel.png',
      },
      {
        name: '大豆',
        pic: '/image/ingredients/soy.png',
      },
      {
        name: '鶏肉',
        pic: '/image/ingredients/chicken.png',
      },
      {
        name: 'バナナ',
        pic: '/image/ingredients/banana.png',
      },
      {
        name: '豚肉',
        pic: '/image/ingredients/pig.png',
      },
      {
        name: 'まつたけ',
        pic: '/image/ingredients/mushroom.png',
      },
      {
        name: 'もも',
        pic: '/image/ingredients/peach.png',
      },
      {
        name: 'やまいも',
        pic: '/image/ingredients/potato.png',
      },
      {
        name: 'りんご',
        pic: '/image/ingredients/apple.png',
      },
      {
        name: 'ゼラチン',
        pic: '/image/ingredients/jelly.png',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
