import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type InviteStore = {
  isInviteOpen: boolean;
  openInviteForm: () => void;
  closeInviteForm: () => void;
  setInviteOpen: (open: boolean) => void;
  selectedMemberIds: number[];
  toggleSelectMember: (id: number) => void;
};

export const useInviteStore = create<InviteStore>()(
  devtools(
    immer((set) => ({
      isInviteOpen: false,
      openInviteForm: () => set({ isInviteOpen: true }),
      closeInviteForm: () => set({ isInviteOpen: false }),
      setInviteOpen: (open) => set({ isInviteOpen: open }),
      selectedMemberIds: [],
      toggleSelectMember: (id) =>
        set((state) => {
          const exists = state.selectedMemberIds.includes(id);

          if (exists) {
            state.selectedMemberIds = state.selectedMemberIds.filter(
              (memberId) => memberId !== id,
            );
          } else {
            state.selectedMemberIds.push(id);
          }
        }),
    })),
  ),
);
