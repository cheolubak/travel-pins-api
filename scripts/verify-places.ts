/**
 * Places 검증 스크립트
 *
 * 1단계: DB에서 의심 장소를 패턴 기반으로 필터링
 * 2단계: 나머지 장소를 네이버 검색 API로 존재 여부 확인
 *
 * 사용법:
 *   # 1단계: 의심 장소 필터링만
 *   pnpm tsx scripts/verify-places.ts --filter-only
 *
 *   # 2단계: 네이버 API 검증 (일 25,000건 제한)
 *   pnpm tsx scripts/verify-places.ts --verify
 *
 *   # 특정 카테고리만 검증
 *   pnpm tsx scripts/verify-places.ts --verify --category 9
 *
 *   # 이전 진행분 이어서 (offset)
 *   pnpm tsx scripts/verify-places.ts --verify --offset 5000
 */

import * as fs from 'fs';
import * as path from 'path';

import { config } from 'dotenv';
import pg from 'pg';

config({ path: path.resolve(__dirname, '../.env') });

// ─── 설정 ───────────────────────────────────────────
const NAVER_CLIENT_ID =
  process.env['NAVER_SEARCH_CLIENT_ID'] ??
  process.env['NAVER_CLIENT_ID'] ??
  '';
const NAVER_CLIENT_SECRET =
  process.env['NAVER_SEARCH_CLIENT_SECRET'] ??
  process.env['NAVER_CLIENT_SECRET'] ??
  '';
const NAVER_API_URL = 'https://openapi.naver.com/v1/search/local.json';
const DAILY_LIMIT = 25_000;
const BATCH_DELAY_MS = 100; // API 호출 간 딜레이 (ms)
const OUTPUT_DIR = path.resolve(__dirname, '../backup/verify');

// ─── 타입 ───────────────────────────────────────────
interface PlaceRow {
  id: string;
  name: string;
  address: string;
  type: string;
  category_id: number;
  category_name: string;
}

interface SuspiciousPlace extends PlaceRow {
  reason: string;
}

interface NaverSearchItem {
  title: string;
  link: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

interface VerifyResult {
  place: PlaceRow;
  found: boolean;
  naverCategory: string | null;
  naverName: string | null;
  categoryMatch: boolean;
  mismatchDetail: string | null;
}

// ─── 의심 패턴 정의 ──────────────────────────────────
const SUSPICIOUS_CATEGORIES = [16, 20, 23, 24, 26, 27, 28]; // 푸드트럭, 철도역, 유원지, 극장, 관광호텔, 고속도로, 공항
const NON_FOOD_KEYWORDS = [
  'PC방',
  '피씨방',
  '피시방',
  '노래방',
  '찜질방',
  '사우나',
  '축제',
  '행사',
];
const MART_KEYWORDS = ['이마트', '롯데마트', '코스트코', '홈플러스', '트레이더스'];

function classifySuspicious(place: PlaceRow): string | null {
  const reasons: string[] = [];

  // 1. 이름 20자 잘림
  if (place.name.length === 20) {
    reasons.push('이름_잘림(20자)');
  }

  // 2. 네이버 지도 미등록 가능성 높은 카테고리
  if (SUSPICIOUS_CATEGORIES.includes(place.category_id)) {
    reasons.push(`비일반_카테고리(${place.category_name})`);
  }

  // 3. 비음식점
  for (const kw of NON_FOOD_KEYWORDS) {
    if (place.name.includes(kw)) {
      reasons.push(`비음식점(${kw})`);
      break;
    }
  }

  // 4. 대형마트 내부 코너
  for (const kw of MART_KEYWORDS) {
    if (place.name.includes(kw)) {
      reasons.push(`마트내부코너(${kw})`);
      break;
    }
  }

  // 5. 카테고리 불일치 - 인도(8)인데 베이커리
  if (place.category_id === 8) {
    const bakeryKeywords = [
      '베이커리',
      '빵',
      '과자',
      '제과',
      '케이크',
      'bakery',
      'bread',
    ];
    for (const kw of bakeryKeywords) {
      if (place.name.toLowerCase().includes(kw)) {
        reasons.push('카테고리_불일치(인도→베이커리)');
        break;
      }
    }
  }

  // 6. 카테고리 불일치 - 멕시칸(7)인데 타코야끼
  if (place.category_id === 7 && place.name.includes('타코야끼')) {
    reasons.push('카테고리_불일치(멕시칸→타코야끼)');
  }

  return reasons.length > 0 ? reasons.join(', ') : null;
}

// ─── 네이버 API 카테고리 → DB 카테고리 매핑 ─────────
const NAVER_TO_DB_CATEGORY: Record<string, string[]> = {
  한식: ['한식'],
  일식: ['일식', '초밥,롤'],
  양식: ['양식', '이탈리안', '프렌치', '스테이크'],
  중식: ['중식', '중국음식'],
  분식: ['분식'],
  아시안: ['아시안', '베트남', '태국', '동남아'],
  멕시칸: ['멕시칸', '멕시코'],
  인도: ['인도음식', '인도', '커리'],
  카페: ['카페', '커피', '디저트카페', '카페,디저트'],
  패스트푸드: ['패스트푸드', '햄버거', '피자'],
};

function checkCategoryMatch(
  dbCategory: string,
  naverCategory: string,
): { match: boolean; detail: string | null } {
  const naverLower = naverCategory.toLowerCase();

  // DB 카테고리에 해당하는 네이버 키워드가 있는지 확인
  const expectedKeywords = NAVER_TO_DB_CATEGORY[dbCategory];
  if (!expectedKeywords) {
    return { match: true, detail: null }; // 매핑 없으면 패스
  }

  for (const kw of expectedKeywords) {
    if (naverLower.includes(kw.toLowerCase())) {
      return { match: true, detail: null };
    }
  }

  // 음식>카페 같은 대분류 매칭
  if (
    naverLower.includes('음식') ||
    naverLower.includes('카페') ||
    naverLower.includes('베이커리')
  ) {
    return {
      match: false,
      detail: `DB: ${dbCategory} ≠ 네이버: ${naverCategory}`,
    };
  }

  return {
    match: false,
    detail: `DB: ${dbCategory} ≠ 네이버: ${naverCategory}`,
  };
}

// ─── 네이버 검색 API 호출 ────────────────────────────
async function searchNaver(query: string): Promise<NaverSearchItem[]> {
  const url = `${NAVER_API_URL}?query=${encodeURIComponent(query)}&display=5`;

  const res = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
    },
  });

  if (!res.ok) {
    if (res.status === 429) {
      console.error('API 호출 한도 초과. 내일 다시 시도해주세요.');
      process.exit(1);
    }
    throw new Error(`Naver API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { items: NaverSearchItem[] };
  return data.items ?? [];
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

async function verifyPlace(place: PlaceRow): Promise<VerifyResult> {
  // 검색어: 이름 + 주소 일부
  const addressShort = place.address.split(' ').slice(0, 2).join(' ');
  const items = await searchNaver(`${place.name} ${addressShort}`);

  if (items.length === 0) {
    // 이름만으로 재검색
    const itemsRetry = await searchNaver(place.name);
    if (itemsRetry.length === 0) {
      return {
        place,
        found: false,
        naverCategory: null,
        naverName: null,
        categoryMatch: false,
        mismatchDetail: '네이버 지도 미등록',
      };
    }

    const best = itemsRetry[0];
    const catCheck = checkCategoryMatch(
      place.category_name,
      best.category ?? '',
    );
    return {
      place,
      found: true,
      naverCategory: best.category,
      naverName: stripHtml(best.title),
      categoryMatch: catCheck.match,
      mismatchDetail: catCheck.detail,
    };
  }

  const best = items[0];
  const catCheck = checkCategoryMatch(
    place.category_name,
    best.category ?? '',
  );

  return {
    place,
    found: true,
    naverCategory: best.category,
    naverName: stripHtml(best.title),
    categoryMatch: catCheck.match,
    mismatchDetail: catCheck.detail,
  };
}

// ─── 결과 저장 ───────────────────────────────────────
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function saveResults(
  filename: string,
  data: unknown,
) {
  ensureDir(OUTPUT_DIR);
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`저장: ${filepath}`);
}

// ─── 1단계: 의심 장소 필터링 ─────────────────────────
async function filterSuspicious(pool: pg.Pool) {
  console.log('\n━━━ 1단계: 의심 장소 패턴 분석 ━━━\n');

  const result = await pool.query<PlaceRow>(`
    SELECT p.id, p.name, p.address, p.type, p.category_id,
           COALESCE(c.name, '없음') as category_name
    FROM places p
    LEFT JOIN category c ON p.category_id = c.id
    ORDER BY p.category_id, p.name
  `);

  const suspicious: SuspiciousPlace[] = [];
  const normal: PlaceRow[] = [];

  for (const place of result.rows) {
    const reason = classifySuspicious(place);
    if (reason) {
      suspicious.push({ ...place, reason });
    } else {
      normal.push(place);
    }
  }

  // 이유별 집계
  const reasonCounts: Record<string, number> = {};
  for (const s of suspicious) {
    for (const r of s.reason.split(', ')) {
      reasonCounts[r] = (reasonCounts[r] ?? 0) + 1;
    }
  }

  console.log(`전체: ${result.rows.length}건`);
  console.log(`의심: ${suspicious.length}건`);
  console.log(`정상 후보: ${normal.length}건`);
  console.log('\n--- 의심 사유별 집계 ---');
  for (const [reason, count] of Object.entries(reasonCounts).sort(
    (a, b) => b[1] - a[1],
  )) {
    console.log(`  ${reason}: ${count}건`);
  }

  // 중복 장소 별도 집계
  const dupResult = await pool.query(`
    SELECT name, address, count(*) as cnt
    FROM places GROUP BY name, address HAVING count(*) > 1
    ORDER BY cnt DESC
  `);
  const totalDupRows = dupResult.rows.reduce(
    (acc: number, r: { cnt: string }) => acc + (parseInt(r.cnt) - 1),
    0,
  );
  console.log(`\n중복 장소: ${dupResult.rows.length}쌍 (삭제 대상 ${totalDupRows}건)`);

  const timestamp = new Date().toISOString().slice(0, 10);
  saveResults(`suspicious_${timestamp}.json`, {
    summary: {
      total: result.rows.length,
      suspicious: suspicious.length,
      normal: normal.length,
      duplicates: { pairs: dupResult.rows.length, removable: totalDupRows },
      reasonCounts,
    },
    suspicious: suspicious.slice(0, 500), // 미리보기
  });

  saveResults(`duplicates_${timestamp}.json`, dupResult.rows);

  return { suspicious, normal, duplicates: dupResult.rows };
}

// ─── 2단계: 네이버 API 검증 ─────────────────────────
async function verifyWithNaver(
  places: PlaceRow[],
  offset: number,
) {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.error('NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 환경변수가 필요합니다.');
    process.exit(1);
  }

  const limit = Math.min(places.length - offset, DAILY_LIMIT);
  const batch = places.slice(offset, offset + limit);

  console.log(`\n━━━ 2단계: 네이버 API 검증 ━━━`);
  console.log(`대상: ${batch.length}건 (offset: ${offset}, 전체: ${places.length}건)`);
  console.log(`일 한도: ${DAILY_LIMIT}건\n`);

  const notFound: VerifyResult[] = [];
  const categoryMismatch: VerifyResult[] = [];
  const verified: VerifyResult[] = [];
  let errorCount = 0;

  for (let i = 0; i < batch.length; i++) {
    const place = batch[i];

    try {
      const result = await verifyPlace(place);

      if (!result.found) {
        notFound.push(result);
      } else if (!result.categoryMatch && result.mismatchDetail) {
        categoryMismatch.push(result);
      } else {
        verified.push(result);
      }
    } catch (err) {
      errorCount++;
      console.error(`  에러 [${place.name}]: ${(err as Error).message}`);
    }

    // 진행률 표시
    if ((i + 1) % 100 === 0 || i === batch.length - 1) {
      console.log(
        `  [${i + 1}/${batch.length}] 정상: ${verified.length} | 미등록: ${notFound.length} | 카테고리불일치: ${categoryMismatch.length} | 에러: ${errorCount}`,
      );
    }

    // API 딜레이
    if (i < batch.length - 1) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  saveResults(`naver_not_found_${timestamp}.json`, {
    count: notFound.length,
    places: notFound.map((r) => ({
      id: r.place.id,
      name: r.place.name,
      address: r.place.address,
      type: r.place.type,
      category: r.place.category_name,
    })),
  });

  saveResults(`naver_category_mismatch_${timestamp}.json`, {
    count: categoryMismatch.length,
    places: categoryMismatch.map((r) => ({
      id: r.place.id,
      name: r.place.name,
      address: r.place.address,
      dbCategory: r.place.category_name,
      naverCategory: r.naverCategory,
      naverName: r.naverName,
    })),
  });

  console.log(`\n━━━ 검증 결과 ━━━`);
  console.log(`정상: ${verified.length}건`);
  console.log(`미등록: ${notFound.length}건`);
  console.log(`카테고리 불일치: ${categoryMismatch.length}건`);
  console.log(`에러: ${errorCount}건`);

  if (offset + limit < places.length) {
    console.log(
      `\n⚠ 남은 장소: ${places.length - offset - limit}건`,
    );
    console.log(
      `  다음 실행: pnpm tsx scripts/verify-places.ts --verify --offset ${offset + limit}`,
    );
  }
}

// ─── 메인 ────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const filterOnly = args.includes('--filter-only');
  const verify = args.includes('--verify');
  const categoryIdx = args.indexOf('--category');
  const categoryFilter =
    categoryIdx !== -1 ? parseInt(args[categoryIdx + 1]) : null;
  const offsetIdx = args.indexOf('--offset');
  const offset = offsetIdx !== -1 ? parseInt(args[offsetIdx + 1]) : 0;

  const pool = new pg.Pool({
    connectionString: process.env['DATABASE_URL'],
    ssl: { rejectUnauthorized: false },
  });

  try {
    const { normal } = await filterSuspicious(pool);

    if (filterOnly) {
      console.log('\n--filter-only: 패턴 분석만 완료.');
      return;
    }

    if (verify) {
      let targets = normal;
      if (categoryFilter !== null) {
        targets = normal.filter((p) => p.category_id === categoryFilter);
        console.log(
          `\n카테고리 ${categoryFilter} 필터: ${targets.length}건`,
        );
      }

      await verifyWithNaver(targets, offset);
    } else {
      console.log('\n사용법:');
      console.log(
        '  pnpm tsx scripts/verify-places.ts --filter-only  # 패턴 분석만',
      );
      console.log(
        '  pnpm tsx scripts/verify-places.ts --verify       # 네이버 API 검증',
      );
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
