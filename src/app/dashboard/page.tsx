"use client";
import { useSession } from "next-auth/react";
import PageWrapper from "../(components)/PageWrapper";
import ProfileCard from "../(components)/Profile/ProfileCard";

export default function ProfilePage() {
  const { data: session } = useSession();
  if (!session) return;

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-start justify-center p-4 ">
        <ProfileCard />

      </div>
    </PageWrapper>
  );
}