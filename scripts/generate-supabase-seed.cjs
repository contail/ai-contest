const fs = require('fs');

const path = 'src/lib/pfctBlogUrls.ts';
const s = fs.readFileSync(path, 'utf8');
const urls = (s.match(/"(https?:\/\/[^\"]+)"/g) || []).map((m) => m.slice(1, -1));

const esc = (v) => String(v).replace(/'/g, "''");
const json = (v) => (v === null ? null : JSON.stringify(v));

const lines = [];
lines.push('-- Supabase seed');
lines.push('begin;');
lines.push('alter table "Challenge" add column if not exists "heroCopy" text;');
lines.push('alter table "Challenge" add column if not exists "cautionText" text;');
lines.push('alter table "Challenge" add column if not exists "datasetLabel" text;');
lines.push('alter table "Challenge" add column if not exists "datasetFileName" text;');
lines.push('alter table "Challenge" add column if not exists "datasetDescription" text;');
lines.push('alter table "Challenge" add column if not exists "datasetDownloadUrl" text;');
lines.push(
  'alter table "Challenge" add column if not exists "restrictDatasetUrl" boolean not null default false;'
);
lines.push(
  'alter table "Challenge" add column if not exists "isPublished" boolean not null default false;'
);
lines.push('alter table "Question" add column if not exists "challengeId" text;');
lines.push('alter table "Question" add column if not exists "order" integer;');
lines.push('alter table "Question" add column if not exists "type" text;');
lines.push('alter table "Question" add column if not exists "prompt" text;');
lines.push('alter table "Question" add column if not exists "options" text;');
lines.push(
  'alter table "Question" add column if not exists "required" boolean not null default false;'
);
lines.push('alter table "DatasetUrl" add column if not exists "challengeId" text;');
lines.push('do $$');
lines.push('begin');
lines.push('  if exists (');
lines.push('    select 1');
lines.push('    from information_schema.columns');
lines.push("    where table_schema = 'public'");
lines.push("      and table_name = 'Challenge'");
lines.push("      and column_name = 'cautiontext'");
lines.push('  ) then');
lines.push('    execute \'alter table "Challenge" alter column "cautiontext" drop not null\';');
lines.push('  end if;');
lines.push('  if exists (');
lines.push('    select 1');
lines.push('    from information_schema.columns');
lines.push("    where table_schema = 'public'");
lines.push("      and table_name = 'Challenge'");
lines.push("      and column_name = 'datasetlabel'");
lines.push('  ) then');
lines.push('    execute \'alter table "Challenge" alter column "datasetlabel" drop not null\';');
lines.push('  end if;');
lines.push('  if exists (');
lines.push('    select 1');
lines.push('    from information_schema.columns');
lines.push("    where table_schema = 'public'");
lines.push("      and table_name = 'Challenge'");
lines.push("      and column_name = 'datasetfilename'");
lines.push('  ) then');
lines.push('    execute \'alter table "Challenge" alter column "datasetfilename" drop not null\';');
lines.push('  end if;');
lines.push('  if exists (');
lines.push('    select 1');
lines.push('    from information_schema.columns');
lines.push("    where table_schema = 'public'");
lines.push("      and table_name = 'Challenge'");
lines.push("      and column_name = 'datasetdescription'");
lines.push('  ) then');
lines.push('    execute \'alter table "Challenge" alter column "datasetdescription" drop not null\';');
lines.push('  end if;');
lines.push('  if exists (');
lines.push('    select 1');
lines.push('    from information_schema.columns');
lines.push("    where table_schema = 'public'");
lines.push("      and table_name = 'Challenge'");
lines.push("      and column_name = 'datasetdownloadurl'");
lines.push('  ) then');
lines.push('    execute \'alter table "Challenge" alter column "datasetdownloadurl" drop not null\';');
lines.push('  end if;');
lines.push('  if exists (');
lines.push('    select 1');
lines.push('    from information_schema.columns');
lines.push("    where table_schema = 'public'");
lines.push("      and table_name = 'Question'");
lines.push("      and column_name = 'challengeid'");
lines.push('  ) then');
lines.push('    execute \'alter table "Question" alter column "challengeid" drop not null\';');
lines.push('  end if;');
lines.push('  if exists (');
lines.push('    select 1');
lines.push('    from information_schema.columns');
lines.push("    where table_schema = 'public'");
lines.push("      and table_name = 'Question'");
lines.push("      and column_name = 'challenge_id'");
lines.push('  ) then');
lines.push('    execute \'alter table "Question" alter column "challenge_id" drop not null\';');
lines.push('  end if;');
lines.push('  if exists (');
lines.push('    select 1');
lines.push('    from information_schema.columns');
lines.push("    where table_schema = 'public'");
lines.push("      and table_name = 'DatasetUrl'");
lines.push("      and column_name = 'challengeid'");
lines.push('  ) then');
lines.push('    execute \'alter table "DatasetUrl" alter column "challengeid" drop not null\';');
lines.push('  end if;');
lines.push('  if exists (');
lines.push('    select 1');
lines.push('    from information_schema.columns');
lines.push("    where table_schema = 'public'");
lines.push("      and table_name = 'DatasetUrl'");
lines.push("      and column_name = 'challenge_id'");
lines.push('  ) then');
lines.push('    execute \'alter table "DatasetUrl" alter column "challenge_id" drop not null\';');
lines.push('  end if;');
lines.push('end $$;');
lines.push('delete from "Answer";');
lines.push('delete from "SubmissionSession";');
lines.push('delete from "DatasetUrl";');
lines.push('delete from "Question";');
lines.push('delete from "Challenge";');
lines.push('');

const challenges = [
  {
    id: 'pfct-news',
    title: 'PFCT Blog Insight',
    subtitle: 'PFCT AI Contest Lab',
    summary:
      'PFCT 블로그 콘텐츠를 기반으로 카테고리·주제 인식과 근거 판별 능력을 확인하는 콘테스트.',
    tags: ['리서치', '콘텐츠 분석', '분류'],
    badge: 'N',
    heroCopy: 'AI 설계 관점에서 근거를 정리하세요',
    description:
      'PFCT 블로그 데이터셋을 기반으로 카테고리와 주제를 정확히 구분하는 능력을 확인합니다. 제공된 URL 목록을 바탕으로 각 질문 항목에 맞는 근거를 선택하세요.',
    cautionText:
      '모든 응답은 지정된 데이터셋 범위 안에서만 인정됩니다. 최종 제출 이후에는 수정이 불가합니다.',
    datasetLabel: 'PFCT 블로그 100건',
    datasetFileName: 'pfct_blog_urls_100.txt',
    datasetDescription: 'PFCT 블로그 게시글 URL 목록',
    datasetDownloadUrl: null,
    restrictDatasetUrl: false,
    isPublished: true,
  },
  {
    id: 'pfct-ocr',
    title: '스마트 배달 배차 분석 챌린지',
    subtitle: 'PFCT AI Contest Lab',
    summary:
      'AI 스마트 배차 엔진의 로그를 분석하여 규칙 준수 여부와 배차 효율을 검증하는 콘테스트.',
    tags: ['운영 분석', '로그 검증', '배차 최적화'],
    badge: 'N',
    heroCopy: '배차 규칙의 적용 결과를 정량적으로 검증하세요',
    description:
      '배달 플랫폼의 효율성을 높이기 위해 도입된 AI 스마트 배차 엔진 로그를 분석합니다. 제공된 라이더 정보와 배차 로그(CSV/JSON)를 바탕으로 규칙이 제대로 적용되었는지 판단하고, 주어진 질문에 답하세요.',
    cautionText:
      '모든 계산은 제공된 데이터셋 기준으로만 수행합니다. 제시된 규칙 외의 가정을 추가하지 마세요.',
    datasetLabel: '배차 로그 3종',
    datasetFileName: 'delivery_data.zip',
    datasetDescription: 'rider_info.json, dispatch_log.csv, pending_orders.csv',
    datasetDownloadUrl: '/datasets/delivery_data.zip',
    restrictDatasetUrl: false,
    isPublished: true,
  },
];

for (const c of challenges) {
  lines.push(
    `insert into "Challenge" (id,title,subtitle,summary,tags,badge,description,"cautionText","datasetLabel","datasetFileName","datasetDescription","datasetDownloadUrl","restrictDatasetUrl","isPublished") values ('${esc(
      c.id
    )}','${esc(c.title)}','${esc(c.subtitle)}','${esc(
      c.summary
    )}','${esc(JSON.stringify(c.tags))}','${esc(c.badge)}','${esc(
      c.description
    )}','${esc(c.cautionText)}','${esc(
      c.datasetLabel
    )}','${esc(c.datasetFileName)}','${esc(
      c.datasetDescription
    )}',${c.datasetDownloadUrl ? `'${esc(c.datasetDownloadUrl)}'` : 'null'},${c.restrictDatasetUrl},${c.isPublished});`
  );
}

lines.push('');

const questions = [
  {
    id: 'pfct-news-q1',
    challengeId: 'pfct-news',
    order: 1,
    type: 'single',
    prompt: '“띵동! 매주 수요일에 찾아오는 행복, 해피아워로”에 해당하는 URL은 무엇인가요?',
    options: [
      'https://blog.pfct.co.kr/happyhour',
      'https://blog.pfct.co.kr/good-time-with-good-people-1',
      'https://blog.pfct.co.kr/2024-year-end-party',
      'https://blog.pfct.co.kr/flexing-year-end',
    ],
    required: true,
  },
  {
    id: 'pfct-news-q2',
    challengeId: 'pfct-news',
    order: 2,
    type: 'short',
    prompt: '전체 URL 문자열에서 “예약투자”는 몇 회 등장하나요? (없으면 0 입력)',
    options: null,
    required: true,
  },
  {
    id: 'pfct-news-q3',
    challengeId: 'pfct-news',
    order: 3,
    type: 'single',
    prompt: '전체 URL 문자열에서 “대출”은 몇 회 등장하나요?',
    options: ['2회', '3회', '4회', '5회'],
    required: true,
  },
  {
    id: 'pfct-news-q4',
    challengeId: 'pfct-news',
    order: 4,
    type: 'short',
    prompt: "하이픈('-')이 4개 이상 포함된 URL은 몇 개인가요? (숫자만 입력)",
    options: null,
    required: true,
  },
  {
    id: 'pfct-news-q5',
    challengeId: 'pfct-news',
    order: 5,
    type: 'short',
    prompt: '도메인을 제외한 slug 기준, 가장 긴 slug의 길이는 몇 자인가요? (숫자만 입력)',
    options: null,
    required: true,
  },
  {
    id: 'pfct-ocr-q1',
    challengeId: 'pfct-ocr',
    order: 1,
    type: 'single',
    prompt:
      'dispatch_log.csv 데이터 중, 선호 지역 가중치 적용으로 인해 실제 거리상 더 가까운 라이더가 있었음에도 배차권을 얻은 ‘역전 배차’ 건수는 몇 건인가요?',
    options: ['2건', '3건', '4건', '5건'],
    required: true,
  },
  {
    id: 'pfct-ocr-q2',
    challengeId: 'pfct-ocr',
    order: 2,
    type: 'single',
    prompt:
      '배차에 성공한 라이더들의 평균 실제 이동 거리(raw_distance)를 긴 순서에서 짧은 순서로 정렬한 것을 고르세요.',
    options: [
      '정스피드 > 박민수 > 이영희 > 김철수 > 최신속',
      '정스피드 > 김철수 > 이영희 > 박민수 > 최신속',
      '최신속 > 박민수 > 이영희 > 김철수 > 정스피드',
      '이영희 > 정스피드 > 김철수 > 박민수 > 최신속',
    ],
    required: true,
  },
  {
    id: 'pfct-ocr-q3',
    challengeId: 'pfct-ocr',
    order: 3,
    type: 'single',
    prompt: '배차 완료 데이터에서, 선호 지역 라이더가 배정된 비율이 가장 높은 지역은 어디인가요?',
    options: ['강남구', '서초구', '역삼동', '송파구'],
    required: true,
  },
  {
    id: 'pfct-ocr-q4',
    challengeId: 'pfct-ocr',
    order: 4,
    type: 'single',
    prompt: 'pending_orders.csv 기준, 배차 실패 원인 중 가장 많이 발생한 사유는 무엇인가요?',
    options: [
      '배달 가능 반경(10km) 초과',
      '라이더의 최대 적재 용량 초과',
      '가용 라이더의 업무 부하(2건) 초과',
      '주문 지역 선호 라이더 부재',
    ],
    required: true,
  },
  {
    id: 'pfct-ocr-q5',
    challengeId: 'pfct-ocr',
    order: 5,
    type: 'single',
    prompt: '모든 배차 완료 후, 남은 적재 용량이 큰 순서대로 라이더를 정렬한 결과는 무엇인가요?',
    options: [
      '정스피드 > 김철수 > 최신속 > 이영희 = 박민수',
      '정스피드 > 이영희 > 박민수 > 김철수 > 최신속',
      '김철수 > 정스피드 > 최신속 > 이영희 = 박민수',
      '최신속 > 이영희 > 박민수 > 정스피드 > 김철수',
    ],
    required: true,
  },
];

for (const q of questions) {
  const options = json(q.options);
  lines.push(
    `insert into "Question" (id,"challengeId","order",type,prompt,options,required) values ('${esc(
      q.id
    )}','${esc(q.challengeId)}',${q.order},'${esc(q.type)}','${esc(
      q.prompt
    )}',${options ? `'${esc(options)}'` : 'null'},${q.required});`
  );
}

lines.push('');

urls.forEach((url, i) => {
  lines.push(
    `insert into "DatasetUrl" (id,"challengeId",url) values ('pfct-news-url-${String(i + 1).padStart(
      3,
      '0'
    )}','pfct-news','${esc(url)}');`
  );
});

lines.push('commit;');

fs.writeFileSync('scripts/supabase-seed.sql', lines.join('\n'));
console.log('scripts/supabase-seed.sql generated');
