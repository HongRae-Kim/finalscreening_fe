import logo from "@/assets/images/logo.svg";
import { BoxButton } from "@/components/common/button/BoxButton";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/auth/login/LoginForm";

export default function page() {
  return (
    <section className="m-auto flex h-full w-125 flex-col items-center justify-center">
      <Image
        src={logo}
        alt="match-my-duo logo"
        className="h-38 w-100 max-md:scale-90"
      />
      <p className="text-content-secondary mt-5 mb-6 text-center max-md:text-base">
        로그인하고 나에게 딱 맞는 듀오를 찾아보세요
      </p>
      {/* 로그인 Form */}
      <LoginForm />

      {/* 회원가입 */}
      <p className="text-content-secondary mt-6 mb-6 text-base max-md:text-sm">
        아직 계정이 없으시다면
      </p>

      <Link href="/signup" className="w-125 max-md:w-115">
        <BoxButton
          text="회원가입"
          tone="color"
          size="xl"
          className="w-full text-xl font-bold max-md:min-w-0"
        >
          회원가입
        </BoxButton>
      </Link>
    </section>
  );
}
