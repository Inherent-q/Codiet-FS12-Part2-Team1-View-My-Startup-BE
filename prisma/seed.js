import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/ko";

const prisma = new PrismaClient();

async function main() {
  await prisma.myselection.deleteMany();
  await prisma.comparisonselection.deleteMany();
  await prisma.investor.deleteMany();
  await prisma.corp.deleteMany();

  // 200개 기업 생성
  const corps = [];

  for (let i = 0; i < 200; i++) {
    corps.push({
      name: faker.company.name(),
      img: `https://picsum.photos/seed/${i}/64/64`,
      description: faker.company.catchPhrase(),
      category: faker.helpers.arrayElement([
        "핀테크",
        "헬스케어",
        "이커머스",
        "에듀테크",
        "SaaS",
        "AI",
        "물류",
        "푸드테크",
      ]),
      accInvest: faker.number.int({ min: 10000000, max: 50000000000 }),
      revenue: faker.number.int({ min: 0, max: 10000000000 }),
      hire: faker.number.int({ min: 1, max: 500 }),
    });
  }

  await prisma.corp.createMany({ data: corps });
  console.log("200개 기업 생성 완료");

  const corpIds = (await prisma.corp.findMany({ select: { id: true } })).map(
    (c) => c.id,
  );

  // 1000명 투자자 생성
  const investors = [];

  for (let i = 0; i < 1000; i++) {
    investors.push({
      name: faker.person.fullName(),
      amount: faker.number.int({ min: 1000000, max: 10000000000 }),
      password: faker.internet.password({ length: 12 }),
      comment: faker.lorem.sentence(),
      corpId: faker.helpers.arrayElement(corpIds),
    });
  }

  await prisma.investor.createMany({ data: investors });
  console.log("1000명 투자자 생성 완료");

  // 100개 비교 선택 생성
  const comparisonselections = [];

  for (let i = 0; i < 100; i++) {
    comparisonselections.push({
      userSessionId: faker.string.uuid(),
      corpId: faker.helpers.arrayElement(corpIds),
    });
  }

  await prisma.comparisonselection.createMany({ data: comparisonselections });
  console.log("100개 비교 선택 생성 완료");

  // 100개 나의 선택 생성
  const myselections = [];

  for (let i = 0; i < 100; i++) {
    myselections.push({
      userSessionId: faker.string.uuid(),
      corpId: faker.helpers.arrayElement(corpIds),
    });
  }

  await prisma.myselection.createMany({ data: myselections });
  console.log("100개 나의 선택 생성 완료");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
