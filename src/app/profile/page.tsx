"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CustomLoader from "../(components)/Components/utils/Loader";

export default function ProfileRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
    } else {
      router.push(`/profile/${session.user.user_id}`);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <CustomLoader random_text fullscreen />;
  }

  return <CustomLoader random_text fullscreen />;
}
