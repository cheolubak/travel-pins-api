import * as fs from 'fs';
import * as path from 'path';

import { config } from 'dotenv';
import proj4 from 'proj4';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../packages/database/generated/prisma/client';

config({ path: path.resolve(__dirname, '../.env') });

// Korean Central Belt (EPSG:5174) → WGS84 (EPSG:4326)
const EPSG5174 =
  '+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs';

const BASE_URL = 'https://apis.data.go.kr/1741000/rest_cafes/info';
const SERVICE_KEY =
  '99f57ba70d2d48f2d2f944f2b3363e2479cb5151fc754d4222e99ef9df604fb0';
const NUM_OF_ROWS = 100;

// CLI 인자로 지역 코드 받기 (기본값: 6110000_ALL 서울)
const REGION_CODE = process.argv[2] || '6110000_ALL';
const REGION_LABELS: Record<string, string> = {
  '6110000_ALL': '서울',
  '6260000_ALL': '부산',
  '6270000_ALL': '대구',
  '6280000_ALL': '인천',
  '6290000_ALL': '광주',
  '6300000_ALL': '대전',
  '6310000_ALL': '울산',
  '6410000_ALL': '경기',
  '6420000_ALL': '강원',
  '5690000_ALL': '세종',
  '6530000_ALL': '강원특별자치도',
  '6430000_ALL': '충북',
  '6440000_ALL': '충남',
  '6540000_ALL': '전북',
  '6460000_ALL': '전남',
  '6470000_ALL': '경북',
  '6480000_ALL': '경남',
  '6500000_ALL': '제주',
};
const REGION_LABEL = REGION_LABELS[REGION_CODE] || REGION_CODE;

interface ApiItem {
  BPLC_NM: string;
  ROAD_NM_ADDR: string;
  LOTNO_ADDR: string;
  ROAD_NM_ZIP: string;
  LCTN_ZIP: string;
  CRD_INFO_X: string;
  CRD_INFO_Y: string;
  BZSTAT_SE_NM: string;
  SNTTN_BZSTAT_NM: string;
  DTL_SALS_STTS_NM: string;
  MNG_NO: string;
  TELNO: string;
  [key: string]: unknown;
}

interface ApiResponse {
  response: {
    header: { resultCode: string; resultMsg: string };
    body: {
      totalCount: number;
      pageNo: number;
      numOfRows: number;
      items: { item: ApiItem[] };
    };
  };
}

// BZSTAT_SE_NM → PlaceType 매핑
function mapPlaceType(bzstatNm: string): 'CAFE' | 'FOOD' | 'STORE' {
  const cafes = ['커피숍', '다방'];
  const stores = ['편의점'];

  if (cafes.includes(bzstatNm)) return 'CAFE';
  if (stores.includes(bzstatNm)) return 'STORE';
  return 'FOOD';
}

// 좌표 변환: EPSG:5174 → WGS84
function convertCoords(
  x: string,
  y: string,
): { lat: number; lng: number } | null {
  const xNum = parseFloat(x);
  const yNum = parseFloat(y);

  if (!xNum || !yNum || isNaN(xNum) || isNaN(yNum)) return null;

  const [lng, lat] = proj4(EPSG5174, 'EPSG:4326', [xNum, yNum]);
  return { lat, lng };
}

async function fetchPage(pageNo: number): Promise<ApiResponse> {
  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    pageNo: String(pageNo),
    numOfRows: String(NUM_OF_ROWS),
    returnType: 'json',
    'cond[OPN_ATMY_GRP_CD::EQ]': REGION_CODE,
    'cond[SALS_STTS_CD::EQ]': '01',
    'cond[LAST_MDFCN_PNT::GTE]': '20240101000000',
  });

  const url = `${BASE_URL}?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as ApiResponse;
}

async function fetchAllData(): Promise<{
  items: ApiItem[];
  totalCount: number;
}> {
  // 첫 페이지로 totalCount 확인
  const firstPage = await fetchPage(1);
  const totalCount = firstPage.response.body.totalCount;
  const totalPages = Math.ceil(totalCount / NUM_OF_ROWS);

  console.log(`Total: ${totalCount}건, ${totalPages} pages`);

  const allItems: ApiItem[] = [...firstPage.response.body.items.item];

  // 나머지 페이지를 5개씩 병렬로 가져오기
  const CONCURRENT = 5;
  for (let i = 2; i <= totalPages; i += CONCURRENT) {
    const pages = Array.from(
      { length: Math.min(CONCURRENT, totalPages - i + 1) },
      (_, idx) => i + idx,
    );

    const results = await Promise.all(pages.map((p) => fetchPage(p)));

    for (const result of results) {
      if (result.response.body.items?.item) {
        allItems.push(...result.response.body.items.item);
      }
    }

    console.log(
      `Fetched pages ${pages[0]}-${pages[pages.length - 1]} (${allItems.length}/${totalCount})`,
    );
  }

  return { items: allItems, totalCount };
}

async function main() {
  console.log(
    `=== 휴게음식점 데이터 시드 시작 [${REGION_LABEL}] (${REGION_CODE}) ===\n`,
  );

  // 1. API에서 전체 데이터 가져오기
  console.log('[1/4] API 데이터 가져오는 중...');
  const { items, totalCount } = await fetchAllData();
  console.log(`\n총 ${items.length}건 가져옴 (API total: ${totalCount})\n`);

  // 2. backup 저장
  console.log('[2/4] backup 저장 중...');
  const backupDir = path.resolve(__dirname, '../backup');
  const backupPath = path.join(
    backupDir,
    `rest_cafes_${REGION_CODE}_${new Date().toISOString().slice(0, 10)}.json`,
  );
  fs.writeFileSync(backupPath, JSON.stringify(items, null, 2), 'utf-8');
  console.log(`Backup saved: ${backupPath}\n`);

  // 3. Prisma 클라이언트 초기화
  console.log('[3/4] DB 연결 중...');
  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    // 4. 카테고리 수집 및 생성
    console.log('[4/4] Category + Place 저장 중...');
    const categoryNames = [
      ...new Set(items.map((item) => item.BZSTAT_SE_NM).filter(Boolean)),
    ];
    console.log(`카테고리: ${categoryNames.join(', ')}`);

    // 카테고리 upsert
    const categoryMap = new Map<string, number>();
    for (const name of categoryNames) {
      const truncatedName = name.slice(0, 20);
      const category = await prisma.category.upsert({
        where: { name: truncatedName },
        update: {},
        create: { name: truncatedName },
      });
      categoryMap.set(name, category.id);
    }
    console.log(`${categoryMap.size}개 카테고리 생성 완료`);

    // 5. Place 데이터 변환 및 저장
    let inserted = 0;
    let skipped = 0;
    const BATCH_SIZE = 100;

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      const placesData = [];

      for (const item of batch) {
        const coords = convertCoords(item.CRD_INFO_X, item.CRD_INFO_Y);
        if (!coords) {
          skipped++;
          continue;
        }

        const address = (item.ROAD_NM_ADDR || item.LOTNO_ADDR || '').slice(
          0,
          200,
        );
        const name = (item.BPLC_NM || '').slice(0, 20);
        const postcode = (item.ROAD_NM_ZIP || item.LCTN_ZIP || '')
          .replace(/-/g, '')
          .slice(0, 6);

        if (!name || !address || !postcode) {
          skipped++;
          continue;
        }

        const placeType = mapPlaceType(item.BZSTAT_SE_NM);
        const categoryId = categoryMap.get(item.BZSTAT_SE_NM) ?? null;

        placesData.push({
          name,
          address,
          postcode,
          type: placeType as 'CAFE' | 'FOOD' | 'STORE',
          lat: coords.lat,
          lng: coords.lng,
          categoryId,
        });
      }

      if (placesData.length > 0) {
        await prisma.places.createMany({
          data: placesData,
          skipDuplicates: true,
        });
        inserted += placesData.length;
      }

      if ((i + BATCH_SIZE) % 1000 === 0 || i + BATCH_SIZE >= items.length) {
        console.log(
          `Progress: ${inserted} inserted, ${skipped} skipped / ${items.length} total`,
        );
      }
    }

    console.log(
      `\n=== 완료 ===\nInserted: ${inserted}\nSkipped: ${skipped}\nTotal processed: ${items.length}`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
