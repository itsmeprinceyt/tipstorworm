"use client";
import { useState, useEffect } from "react";
import PageWrapper from "../../../(components)/PageWrapper";
import Maintenance from "../../../(components)/Components/utils/Maintenance";
import { getSetting } from "../../../../lib/settings-client";
import CustomLoader from "../../../(components)/Components/utils/Loader";

export default function ModDashboard() {
  const [pageEnabled, setPageEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isPageEnabled = await getSetting("DASHBOARD_MOD");
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
  return (
    <PageWrapper>
      <div className="text-white min-h-screen flex items-center justify-center">
        hey
      </div>
    </PageWrapper>
  );
}
