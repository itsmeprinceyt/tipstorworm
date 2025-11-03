"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import PageWrapper from "../../(components)/PageWrapper";
import ProfileCard from "../../(components)/Profile/ProfileCard";

import { getSetting } from "../../../lib/settings-client";

import Maintenance from "../../(components)/Components/utils/Maintenance";
import CustomLoader from "../../(components)/Components/utils/Loader";

export default function ProfilePage() {
  const { data: session } = useSession();

  const [pageEnabled, setPageEnabled] = useState<boolean | null>(null);
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isPageEnabled = await getSetting("DASHBOARD_USER");
        setPageEnabled(isPageEnabled);
      } catch {
        setPageEnabled(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (pageEnabled === null) {
    return <CustomLoader fullscreen />;
  }

  if (!pageEnabled) {
    return <Maintenance />;
  }
  if (!session) return;

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-start justify-center p-4 ">
        <ProfileCard />
      </div>
    </PageWrapper>
  );
}
