import { CornerDownRight } from "lucide-react";

export default function FindLinkButton({
  gameMode,
  postTitle,
}: {
  gameMode?: string;
  postTitle?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <CornerDownRight
        size={17}
        className="text-content-secondary ml-1 shrink-0"
      />
      <p className="text-accent/50 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
        {gameMode ?? "게임모드"}
        <span className="text-content-secondary ml-1">
          {postTitle ?? "모집글 설명"}
        </span>
      </p>
    </div>
  );
}
