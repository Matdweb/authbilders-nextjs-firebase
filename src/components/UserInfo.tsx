'use client';
import { Tooltip, User } from "@heroui/react";
import { signOut } from "@/app/lib/actions";
import { DecodedIdToken } from "firebase-admin/auth";
import { usePathname } from "next/navigation";

interface Data {
  email?: string;
  imgUrl?: string;
  name?: string;
}

export function UserInfo({
  data
}: {
  data: DecodedIdToken | undefined;
}) {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signUp") return null;

  const retrieveUserInfo = () => {
    if (data) {
      return {
        email: data.email,
      }
    }
    return {}
  }

  const userData: Data = retrieveUserInfo();

  return (
    <Tooltip color={"primary"} content={"Sign Out"} placement={"left"}>
      <User
        avatarProps={{
          src: userData?.imgUrl || "",
        }}
        description={userData.email || "@but who?"}
        name={userData.name || "someone"}
        className="absolute bottom-0 right-0 p-4 cursor-pointer"
        onClick={signOut}
      />
    </Tooltip>
  );
} 