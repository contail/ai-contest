import Header from "@/components/site/Header";

export const metadata = {
  title: "개인정보처리방침 | AI Challenge Hub",
  description: "AI Challenge Hub 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-[var(--gray-900)]">
          개인정보처리방침
        </h1>

        <div className="prose prose-gray max-w-none space-y-8 text-[var(--gray-700)]">
          <section>
            <h2 className="mb-4 text-xl font-bold text-[var(--gray-900)]">
              제1조 [개인정보의 수집 및 이용 목적]
            </h2>
            <p className="leading-relaxed">
              AI Challenge Hub(이하 &quot;서비스&quot;)는 다음의 목적을 위하여 개인정보를
              처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는
              이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는
              등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공</li>
              <li>서비스 제공: 챌린지 참여, 답안 제출, 점수 산출 등</li>
              <li>서비스 개선: 서비스 이용 현황 분석 및 개선</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[var(--gray-900)]">
              제2조 [수집하는 개인정보 항목]
            </h2>
            <p className="mb-3 leading-relaxed">
              서비스는 회원가입 및 서비스 이용을 위해 다음과 같은 개인정보를
              수집합니다.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Google 계정 연동 시: 이메일 주소, 프로필 이름</li>
              <li>서비스 이용 과정에서 생성되는 정보: 닉네임, 제출 답안, 점수</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[var(--gray-900)]">
              제3조 [개인정보의 보유 및 이용기간]
            </h2>
            <p className="leading-relaxed">
              서비스는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
              개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
              개인정보를 처리·보유합니다. 회원 탈퇴 시 개인정보는 지체 없이
              파기됩니다.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[var(--gray-900)]">
              제4조 [개인정보의 제3자 제공]
            </h2>
            <p className="leading-relaxed">
              서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[var(--gray-900)]">
              제5조 [개인정보의 파기]
            </h2>
            <p className="leading-relaxed">
              서비스는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
              불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[var(--gray-900)]">
              제6조 [이용자의 권리]
            </h2>
            <p className="leading-relaxed">
              이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할
              수 있으며, 가입해지를 요청할 수도 있습니다. 개인정보 조회, 수정을
              위해서는 서비스 내 설정 메뉴를 이용하시면 됩니다.
            </p>
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

