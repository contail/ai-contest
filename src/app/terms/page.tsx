import Header from "@/components/site/Header";

export const metadata = {
  title: "이용약관 | AI Challenge Hub",
  description: "AI Challenge Hub 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-[var(--gray-900)]">
          서비스 이용약관
        </h1>

        <div className="prose prose-gray max-w-none space-y-8 text-[var(--gray-700)]">
          <section>
            <h2 className="mb-4 text-xl font-bold text-[var(--gray-900)]">
              제1장 총칙
            </h2>

            <article className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--gray-800)]">
                제1조 [목적]
              </h3>
              <p className="leading-relaxed">
                본 약관은 AI Challenge Hub(이하 &quot;서비스&quot;)를 이용하는 데 필요한
                권리·의무 및 책임사항, 이용조건 및 절차 등 기본적인 사항,
                운영자와 &quot;회원&quot;간의 권리 및 의무를 규정함을 목적으로 합니다.
              </p>
            </article>

            <article className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--gray-800)]">
                제2조 [용어의 정의]
              </h3>
              <p className="mb-3 leading-relaxed">
                본 약관에서 사용하는 용어는 다음과 같이 정의합니다.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  &quot;서비스&quot;라 함은 AI Challenge Hub 웹사이트를 통한 AI 챌린지 문제 제공,
                  랭킹 기능 및 관련 콘텐츠 제공 등 회원이 이용할 수 있는 다양한
                  서비스를 통칭합니다.
                </li>
                <li>
                  &quot;콘텐츠&quot;라 함은 서비스에서 사용되는 문자·이미지·데이터 등으로
                  표현된 자료 또는 정보를 말합니다.
                </li>
                <li>
                  &quot;회원&quot;이라 함은 본 약관에 동의하고 회원 가입이 승인된 자로서,
                  서비스를 이용할 수 있는 자를 말합니다.
                </li>
                <li>
                  &quot;챌린지 문제&quot;라 함은 기획·제작된 경진대회의 문제 및 이와 관련된
                  데이터셋, 설명자료, 평가기준 등 제반 콘텐츠를 의미합니다.
                </li>
                <li>
                  &quot;제출물&quot;이라 함은 회원이 챌린지 문제 해결을 위해 작성하여 제출하는
                  답안 등 일체의 산출물을 의미합니다.
                </li>
              </ul>
            </article>

            <article className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--gray-800)]">
                제3조 [약관의 게시와 개정]
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  본 약관의 내용은 웹사이트에 게시하거나 기타의 방법으로 공지하고,
                  본 약관에 동의한 회원 모두에게 그 효력이 발생합니다.
                </li>
                <li>
                  운영자는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수
                  있습니다. 약관을 개정할 경우에는 적용일자 및 개정내용을 명시하여
                  최소한 그 적용일 7일 이전에 웹사이트에 게시하여 회원에게
                  공지합니다.
                </li>
              </ul>
            </article>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[var(--gray-900)]">
              제2장 회원가입
            </h2>

            <article className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--gray-800)]">
                제4조 [회원가입]
              </h3>
              <p className="leading-relaxed">
                회원으로 등록하여 서비스를 이용하려는 자는 본 약관을 읽고 동의하신
                후 회원 가입을 신청할 수 있고, 운영자는 그 신청에 대한 승낙을 통해
                회원 가입 절차를 완료하고, 가입 신청자에게 서비스 이용을 위한
                계정을 부여합니다.
              </p>
            </article>

            <article className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--gray-800)]">
                제5조 [서비스 운영을 위한 정보 처리]
              </h3>
              <p className="mb-3 leading-relaxed">
                운영자는 서비스 제공 및 운영을 위해 다음의 정보를 수집·처리합니다.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Google 인증 과정에서 제공되는 회원 식별 정보</li>
                <li>회원이 서비스 내에서 설정하는 닉네임</li>
                <li>회원이 제출하는 제출물(답안 등)</li>
              </ul>
            </article>

            <article className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--gray-800)]">
                제6조 [회원 탈퇴]
              </h3>
              <p className="leading-relaxed">
                회원은 언제든지 웹사이트를 통해 회원 탈퇴를 신청할 수 있으며, 이
                경우 운영자는 관련 법령 등이 정하는 바에 따라 이를 지체 없이
                처리합니다.
              </p>
            </article>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[var(--gray-900)]">
              제3장 서비스 이용
            </h2>

            <article className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--gray-800)]">
                제7조 [서비스의 내용]
              </h3>
              <p className="mb-3 leading-relaxed">
                운영자는 웹사이트를 통하여 다음의 서비스를 제공합니다.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>챌린지 문제의 게시, 열람</li>
                <li>회원의 제출물 제출 기능</li>
                <li>제출물의 자동 평가, 랭킹 산출 등</li>
                <li>기타 서비스 제공에 필요한 부가 서비스 제공</li>
              </ul>
            </article>

            <article className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--gray-800)]">
                제8조 [서비스 제공 및 중단]
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  운영자는 본 서비스를 무료로 제공하며, 서비스의 제공 시간, 방식,
                  내용 등은 운영 정책에 따라 결정됩니다.
                </li>
                <li>
                  운영자는 운영상 필요, 시스템 점검, 서비스 개선 등의 사유로 사전
                  통지 없이 서비스의 전부 또는 일부를 언제든지 변경, 중단 또는
                  종료할 수 있습니다.
                </li>
              </ul>
            </article>

            <article className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--gray-800)]">
                제9조 [금지행위]
              </h3>
              <p className="mb-3 leading-relaxed">
                회원은 서비스 이용과 관련하여 다음의 행위를 해서는 안 됩니다.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>타인의 계정을 도용하거나 사칭하는 행위</li>
                <li>
                  해킹, 시스템 무단 접근, 악성코드 유포 등 서비스의 안정적 운영을
                  방해하는 행위
                </li>
                <li>
                  시스템 오류, 버그 등을 악용하여 부당이득을 취하는 행위
                </li>
                <li>타인을 기망하여 이득을 취하거나 타인에게 피해를 입히는 행위</li>
                <li>
                  콘텐츠를 무단 복제, 배포, 전송하거나 외부 플랫폼에 업로드하는
                  행위
                </li>
                <li>
                  자동화된 도구, 크롤링 등 기술적 수단을 이용하여 콘텐츠를 대량
                  수집하는 행위
                </li>
              </ul>
            </article>

            <article className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--gray-800)]">
                제10조 [콘텐츠에 대한 권리]
              </h3>
              <p className="leading-relaxed">
                운영자가 제공하는 서비스 및 콘텐츠(챌린지 문제, 관련 자료, 시스템,
                디자인 등 포함)에 대한 저작권 등 지식재산권은 운영자에 귀속됩니다.
                회원은 콘텐츠를 개인적이고 비상업적인 목적으로만 이용할 수 있습니다.
              </p>
            </article>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[var(--gray-900)]">
              제4장 기타
            </h2>

            <article className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--gray-800)]">
                제11조 [손해배상 및 면책사항]
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  운영자는 무료로 제공되는 서비스의 이용과 관련하여 회원에게 발생한
                  손해에 대하여 책임을 지지 않습니다. 다만, 운영자의 고의 또는
                  중과실로 인한 손해의 경우에는 관련 법령에 따라 그 손해를
                  배상합니다.
                </li>
                <li>
                  운영자는 천재지변을 포함한 불가항력, 회원의 귀책사유, 제3자가
                  제공하는 서비스의 장애 등으로 인한 손해에 대하여 책임을 지지
                  않습니다.
                </li>
              </ul>
            </article>

            <article className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-[var(--gray-800)]">
                제12조 [분쟁의 해결]
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  본 약관 또는 서비스와 관련된 회원과 운영자의 관계는 대한민국의
                  법령이 적용됩니다.
                </li>
                <li>
                  본 약관 또는 서비스와 관련하여 회원과 운영자 사이에 분쟁이 발생할
                  경우, 그 분쟁의 처리는 대한민국 민사소송법에서 정한 절차를
                  따릅니다.
                </li>
              </ul>
            </article>
          </section>

          <div className="mt-12 rounded-lg bg-[var(--gray-100)] p-4 text-sm text-[var(--gray-600)]">
            <p>공지 일자: 2026년 1월 1일</p>
            <p>적용 일자: 2026년 1월 1일</p>
          </div>
        </div>
      </main>
    </>
  );
}

