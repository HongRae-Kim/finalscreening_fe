import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { BoxButton } from "./button/BoxButton";
import FormModalContainer from "./container/FormModalContainer";

type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  cancleText?: string;
  confirmText?: string;
};

export function ConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  cancleText = "닫기",
  confirmText = "확인",
}: ConfirmModalProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 z-90 bg-black/60" />

        <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 z-90 max-h-[85vh] w-[90vw] max-w-123.5 -translate-x-1/2 -translate-y-1/2 rounded-md focus:outline-none">
          <FormModalContainer>
            <AlertDialog.Title className="text-xl font-bold">
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description className="text-content-secondary mt-4 text-sm">
              {description}
            </AlertDialog.Description>
            <div className="mt-4 flex justify-end gap-3">
              <AlertDialog.Cancel asChild>
                <BoxButton
                  text={cancleText}
                  tone="black"
                  onClick={() => onOpenChange(false)}
                  size="sm"
                />
              </AlertDialog.Cancel>

              <AlertDialog.Action asChild>
                <BoxButton
                  text={confirmText}
                  tone="negative"
                  onClick={async () => {
                    await onConfirm();
                    onOpenChange(false);
                  }}
                  size="sm"
                />
              </AlertDialog.Action>
            </div>{" "}
          </FormModalContainer>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
