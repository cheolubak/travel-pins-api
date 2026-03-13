import * as fs from 'fs';
import * as path from 'path';

import { config } from 'dotenv';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../packages/database/generated/prisma/client';

config({ path: path.resolve(__dirname, '../.env') });

// 새로운 카테고리 매핑 (id → name)
const CATEGORIES: Record<number, string> = {
  1: '한식',
  2: '일식',
  3: '양식',
  4: '중식',
  5: '분식',
  6: '아시안',
  7: '멕시칸',
  8: '인도',
  9: '카페',
};

// 카테고리별 키워드 (우선순위 높은 것부터)
const CATEGORY_KEYWORDS: { categoryId: number; keywords: string[] }[] = [
  {
    categoryId: 2, // 일식
    keywords: [
      '일식',
      '초밥',
      '스시',
      'sushi',
      '라멘',
      'ramen',
      '돈까스',
      '돈카츠',
      '우동',
      '소바',
      '사시미',
      '이자카야',
      '규동',
      '가츠',
      '텐동',
      '텐뿌라',
      '오니기리',
      '다코야키',
      '타코야키',
      '야키토리',
      '야키니쿠',
      '오코노미야키',
      '규카츠',
      '카이센',
      '롤',
      '마키',
      '이자카',
      '사케',
      '일본',
      '호리에',
      '미나미',
      '에키노마에',
    ],
  },
  {
    categoryId: 7, // 멕시칸
    keywords: [
      '멕시칸',
      '멕시코',
      'mexican',
      '타코',
      'taco',
      '부리또',
      'burrito',
      '퀘사디아',
      'quesadilla',
      '나초',
      'nacho',
      '살사',
      '과카몰리',
      '치폴레',
      'chipotle',
    ],
  },
  {
    categoryId: 8, // 인도
    keywords: [
      '인도',
      'india',
      'indian',
      '커리',
      'curry',
      '탄두리',
      'tandoori',
      '비리야니',
      'biryani',
      '마살라',
      'masala',
      '인디안',
      '난(',
      '라씨',
      '차이',
    ],
  },
  {
    categoryId: 6, // 아시안
    keywords: [
      '아시안',
      'asian',
      '태국',
      '타이',
      'thai',
      '베트남',
      'vietnam',
      '쌀국수',
      '팟타이',
      '똠양',
      '반미',
      '필리핀',
      '말레이시아',
      '인도네시아',
      '나시고렝',
      '분짜',
      '파인다이닝',
      '월남',
      '동남아',
    ],
  },
  {
    categoryId: 4, // 중식
    keywords: [
      '중식',
      '중화',
      '짜장',
      '짬뽕',
      '탕수육',
      '마라',
      '훠궈',
      '딤섬',
      '양꼬치',
      '깐풍',
      '깐쇼',
      '유린기',
      '중국',
      '차이나',
      'chinese',
      '마라탕',
      '꿔바로우',
      '경장육',
      '짜장면',
      '울면',
      '완탕',
      '탄탄면',
    ],
  },
  {
    categoryId: 5, // 분식
    keywords: [
      '분식',
      '떡볶이',
      '라볶이',
      '붕어빵',
      '호떡',
      '핫도그',
      '토스트',
      '쌀강정',
      '오방떡',
      '순대',
      '튀김',
      '오뎅',
      '떡볶',
      '떡꼬치',
      '꽈배기',
    ],
  },
  {
    categoryId: 3, // 양식
    keywords: [
      '양식',
      '파스타',
      'pasta',
      '피자',
      'pizza',
      '스테이크',
      'steak',
      '브런치',
      'brunch',
      '버거',
      'burger',
      '햄버거',
      '샌드위치',
      'sandwich',
      '리조또',
      'risotto',
      '오믈렛',
      '그릴',
      'grill',
      '비스트로',
      'bistro',
      '바베큐',
      'bbq',
      '프렌치',
      '이탈리안',
      '달러피자',
      '오븐',
      '로스트',
    ],
  },
  {
    categoryId: 1, // 한식
    keywords: [
      '한식',
      '갈비',
      '불고기',
      '비빔',
      '김치',
      '삼겹',
      '국밥',
      '찌개',
      '전골',
      '보쌈',
      '족발',
      '냉면',
      '칼국수',
      '수제비',
      '해장',
      '감자탕',
      '순두부',
      '곱창',
      '대패',
      '설렁탕',
      '육개장',
      '삼계탕',
      '김밥',
      '덮밥',
      '도시락',
      '한정식',
      '백반',
      '제육',
      '갈비탕',
      '뚝배기',
      '국수',
      '막국수',
      '삼겹살',
      '육회',
      '어묵',
      '떡갈비',
      '쭈꾸미',
      '낙지',
      '해물',
      '볶음밥',
      '백숙',
      '닭갈비',
      '닭발',
      '양념치킨',
      '치킨',
      '찜닭',
      '닭볶음',
      '부대찌개',
      '된장',
      '청국장',
      '콩나물',
      '전',
      '파전',
      '빈대떡',
      '보리밥',
      '정식',
      '쌈밥',
      '생선구이',
    ],
  },
  {
    categoryId: 9, // 카페
    keywords: [
      '카페',
      'cafe',
      'coffee',
      '커피',
      '다방',
      '베이커리',
      'bakery',
      '빵',
      '디저트',
      'dessert',
      '케이크',
      'cake',
      '마카롱',
      'macaron',
      '크로아상',
      '와플',
      'waffle',
      '도넛',
      'donut',
      '빙수',
      '아이스크림',
      'ice cream',
      '스무디',
      '요거트',
      'yogurt',
      '주스',
      'juice',
      '찻집',
      '제과',
      '명과',
      '컵케이크',
      '베이크',
      'bake',
      '로스팅',
      '에스프레소',
      '라떼',
      'latte',
      '브레드',
      'bread',
      '프라페',
      '더벤티',
      '투썸',
      '이디야',
      '스타벅스',
      '컴포즈',
      '메가커피',
      '메가MGC',
      '빽다방',
      '할리스',
      '탐앤탐스',
      '엔제리너스',
      '폴바셋',
      '블루보틀',
      '파스쿠찌',
      '공차',
      '쥬씨',
      '배스킨',
      'baskin',
    ],
  },
];

// PlaceType 기반 카테고리 추론 (이름으로 매핑 실패 시 사용)
function getCategoryByType(type: string): number | null {
  if (type === 'CAFE') return 9; // 카페
  return null;
}

// 기존 BZSTAT_SE_NM 카테고리명 기반 매핑
function getCategoryByOldCategory(oldCategoryName: string): number | null {
  const mapping: Record<string, number> = {
    커피숍: 9,
    다방: 9,
    전통찻집: 9,
    아이스크림: 9,
    과자점: 9,
    떡카페: 9,
    키즈카페: 9,
  };
  return mapping[oldCategoryName] ?? null;
}

// 이름 기반 카테고리 분류
function classifyByName(name: string): number | null {
  const lowerName = name.toLowerCase();

  for (const { categoryId, keywords } of CATEGORY_KEYWORDS) {
    for (const keyword of keywords) {
      if (lowerName.includes(keyword.toLowerCase())) {
        return categoryId;
      }
    }
  }

  return null;
}

async function main() {
  console.log('=== Places 카테고리 재분류 시작 ===\n');

  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    // 1. 기존 카테고리 정보 가져오기
    const existingCategories = await prisma.category.findMany();
    const oldCategoryMap = new Map<number, string>();
    for (const cat of existingCategories) {
      oldCategoryMap.set(cat.id, cat.name);
    }
    console.log(
      `기존 카테고리: ${existingCategories.map((c) => `${c.id}:${c.name}`).join(', ')}`,
    );

    // 2. 새로운 카테고리 upsert (ID 1~9)
    console.log('\n새 카테고리 생성/업데이트 중...');
    for (const [id, name] of Object.entries(CATEGORIES)) {
      await prisma.category.upsert({
        where: { id: Number(id) },
        update: { name },
        create: { id: Number(id), name },
      });
    }
    console.log('카테고리 1~9 생성 완료');

    // 3. 모든 places 가져오기
    const allPlaces = await prisma.places.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        categoryId: true,
        address: true,
      },
    });
    console.log(`\n총 ${allPlaces.length}개 place 분석 중...`);

    // 4. 분류
    const categorized: { id: string; name: string; categoryId: number }[] = [];
    const uncategorized: {
      id: string;
      name: string;
      type: string;
      address: string;
      oldCategoryId: number | null;
      oldCategoryName: string | null;
    }[] = [];
    const stats: Record<number, number> = {};

    for (const place of allPlaces) {
      // Step 1: 이름으로 분류 시도
      let newCategoryId = classifyByName(place.name);

      // Step 2: 기존 카테고리명으로 분류 시도
      if (
        newCategoryId === null &&
        place.categoryId &&
        oldCategoryMap.has(place.categoryId)
      ) {
        newCategoryId = getCategoryByOldCategory(
          oldCategoryMap.get(place.categoryId)!,
        );
      }

      // Step 3: PlaceType으로 분류 시도
      if (newCategoryId === null) {
        newCategoryId = getCategoryByType(place.type);
      }

      if (newCategoryId !== null) {
        categorized.push({ id: place.id, name: place.name, categoryId: newCategoryId });
        stats[newCategoryId] = (stats[newCategoryId] || 0) + 1;
      } else {
        uncategorized.push({
          id: place.id,
          name: place.name,
          type: place.type,
          address: place.address,
          oldCategoryId: place.categoryId,
          oldCategoryName: place.categoryId
            ? oldCategoryMap.get(place.categoryId) ?? null
            : null,
        });
      }
    }

    // 5. 분류 결과 출력
    console.log('\n=== 분류 결과 ===');
    for (const [catId, name] of Object.entries(CATEGORIES)) {
      console.log(`  ${catId}. ${name}: ${stats[Number(catId)] || 0}건`);
    }
    console.log(`  미분류: ${uncategorized.length}건`);
    console.log(`  총: ${allPlaces.length}건`);

    // 6. DB 업데이트
    console.log('\n카테고리 업데이트 중...');
    const BATCH_SIZE = 500;
    let updated = 0;

    for (let i = 0; i < categorized.length; i += BATCH_SIZE) {
      const batch = categorized.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map((place) =>
          prisma.places.update({
            where: { id: place.id },
            data: { categoryId: place.categoryId },
          }),
        ),
      );

      updated += batch.length;
      if (updated % 5000 === 0 || i + BATCH_SIZE >= categorized.length) {
        console.log(`  ${updated}/${categorized.length} 업데이트 완료`);
      }
    }

    // 7. 미분류 places를 JSON으로 저장
    if (uncategorized.length > 0) {
      const outputPath = path.resolve(
        __dirname,
        '../backup/uncategorized-places.json',
      );
      fs.writeFileSync(
        outputPath,
        JSON.stringify(uncategorized, null, 2),
        'utf-8',
      );
      console.log(`\n미분류 ${uncategorized.length}건 → ${outputPath}`);
    }

    // 8. 사용하지 않는 기존 카테고리 정리 (ID > 9)
    const unusedCategories = existingCategories.filter((c) => c.id > 9);
    if (unusedCategories.length > 0) {
      console.log(
        `\n기존 카테고리 중 ID > 9인 항목 ${unusedCategories.length}개는 유지됩니다.`,
      );
      console.log(
        `  ${unusedCategories.map((c) => `${c.id}:${c.name}`).join(', ')}`,
      );
    }

    console.log('\n=== 완료 ===');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
