import { Link } from "lucide-react";
import SignUpForm from "@/components/auth/signup/SignUpForm";

export default function page() {
  return (
    <section className="flex h-full w-full flex-col items-center justify-center">
      <div className="max-md:w-110">
        <div className="flex flex-col items-center justify-center gap-4 max-md:gap-3">
          <Link width={50} height={50} className="text-accent" />
          <p className="text-content-primary text-5xl font-bold max-md:text-4xl">
            회원가입
          </p>
          <p className="text-content-secondary text-center text-lg max-md:text-base">
            지금 가입하고 매치마이듀오와 함께해요
          </p>
        </div>
        <SignUpForm />
      </div>
    </section>
  );
}
