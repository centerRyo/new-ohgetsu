import { PrismaService } from './prisma.service';

// 外部キー制約の順序に従って全テーブルを空にする。
// 各 spec は同じ DB を共有するため、前の spec の残骸を持ち越さないよう
// beforeAll / afterAll で呼び出す。
export const resetDb = async (prisma: PrismaService) => {
  await prisma.menus.deleteMany();
  await prisma.restaurants.deleteMany();
  await prisma.genres.deleteMany();
  await prisma.ingredients.deleteMany();
};
