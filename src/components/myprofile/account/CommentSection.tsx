import { BoxButton } from "@/components/common/button/BoxButton";
import TextInput from "@/components/common/TextInput";
import IntroduceBubble from "@/components/profile/IntroduceBubble";
import ClientApi from "@/lib/clientApi";
import { showToast } from "@/lib/toast";
import { useEffect, useRef, useState } from "react";

interface CommentProps {
  initialComment: string;
}

export default function CommentSection({ initialComment }: CommentProps) {
  const [comment, setComment] = useState<string>("");
  const [tempComment, setTempComment] = useState<string>("");
  const [isCommentEditing, setIsCommentEditing] = useState<boolean>(false);
  const [commentError, setCommentError] = useState<string>("");

  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setComment(initialComment);
  }, [initialComment]);

  useEffect(() => {
    if (isCommentEditing && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [isCommentEditing]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentError) return;
    try {
      const res = await ClientApi("/api/v1/users/me/comment", {
        method: "PATCH",
        body: JSON.stringify({ comment: tempComment }),
      });

      if (res.ok) {
        showToast.success("소개를 변경했습니다.");
        setComment(tempComment);
        setIsCommentEditing(false);
      } else {
        showToast.error("소개 변경에 실패했습니다.");
      }
    } catch (error) {
      showToast.error("서버 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h3>소개</h3>
      {isCommentEditing ? (
        <form className="flex flex-col gap-2" onSubmit={handleCommentSubmit}>
          <TextInput
            ref={commentInputRef}
            value={tempComment}
            onChange={(e) => setTempComment(e.target.value)}
            placeholder={comment}
            className="h-12 py-4 text-base"
          />
          {commentError && <p className="ml-2 text-sm text-negative">{commentError}</p>}
          <div className="mt-[11px] mr-2 flex gap-4 self-end">
            <button
              type="submit"
              className="text-accent cursor-pointer hover:underline"
              onClick={() => {
                setCommentError("");
                if (comment === tempComment) {
                  setCommentError(
                    "변경하려는 소개글이 현재 소개글과 동일합니다.",
                  );
                  return;
                }
                if (tempComment.length > 40) {
                  setCommentError(
                    "소개글은 40자 이하여야 합니다.",
                  );
                  return;
                }
              }}
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCommentEditing(false);
                setTempComment(comment);
              }}
              className="text-content-secondary cursor-pointer hover:underline"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-2">
          {comment ? (
            <IntroduceBubble
              content={comment}
              type="message"
              className="text-sm"
            />
          ) : (
            <IntroduceBubble
              content="아직 자기소개를 작성하지 않았어요."
              type="message"
              className="text-sm"
            />
          )}
          <BoxButton
            text="수정"
            tone="color"
            size="xs"
            className="flex-nowrap self-end"
            onClick={() => {
              setTempComment(comment);
              setIsCommentEditing(true);
              setCommentError("");
            }}
          />
        </div>
      )}
    </div>
  );
}
