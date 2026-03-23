import ClientApi from "@/lib/clientApi";
import { BanUser } from "@/types/userList";

export async function getBanUsersList() {
  const res = await ClientApi(`/api/v1/users/me/blocks`, {
    method: "GET",
  });

  if (!res.ok) {
    return null;
  }

  return (await res.json()) as BanUser[];
}
