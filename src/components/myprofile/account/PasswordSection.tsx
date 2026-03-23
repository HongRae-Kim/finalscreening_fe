import { BoxButton } from "@/components/common/button/BoxButton";
import TextInput from "@/components/common/TextInput";
import ClientApi from "@/lib/clientApi";
import { passwordSchema } from "@/lib/validation/passwordSchema";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function PasswordSection() {
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm) {
      showToast.error("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
      setPasswordError("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    const parsedNewPW = passwordSchema.safeParse(newPassword);
    if (!parsedNewPW.success) {
      setPasswordError(parsedNewPW.error.issues[0]?.message);
      return;
    }

    try {
      const res = await ClientApi("/api/v1/users/me/password", {
        method: "PATCH",
        body: JSON.stringify({
          password: password,
          newPassword: newPassword,
          newPasswordConfirm: newPasswordConfirm,
        }),
      });

      if (res.ok) {
        showToast.success("비밀번호를 변경했습니다.");
      } else {
        showToast.error("비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      showToast.error("서버 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h3>비밀번호 변경</h3>
      <form className="flex flex-col gap-2">
        <TextInput
          className="text-sm"
          type={showPassword ? "text" : "password"}
          placeholder="현재 비밀번호"
          onChange={(e) => setPassword(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-content-tertiary hover:text-content-secondary"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          }
        />
        <TextInput
          className="text-sm"
          type={showNewPassword ? "text" : "password"}
          placeholder="새 비밀번호"
          onChange={(e) => setNewPassword(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="text-content-tertiary hover:text-content-secondary"
            >
              {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          }
        />
        <TextInput
          className="text-sm"
          type={showNewPasswordConfirm ? "text" : "password"}
          placeholder="새 비밀번호 확인"
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
              className="text-content-tertiary hover:text-content-secondary"
            >
              {showNewPasswordConfirm ? (
                <Eye size={20} />
              ) : (
                <EyeOff size={20} />
              )}
            </button>
          }
        />
        {passwordError && <span className="ml-2 text-sm text-negative">{passwordError}</span>}
        <BoxButton
          text="수정"
          tone="color"
          size="xs"
          className="mt-2 flex-nowrap self-end"
          onClick={handlePasswordSubmit}
        />
      </form>
    </div>
  );
}
