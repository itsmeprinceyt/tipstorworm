"use client";
import { ImageKitProvider } from "@imagekit/next";

/**
 * @brief A wrapper component for the ImageKit React provider that injects the `urlEndpoint`
 * (configured in environment variables) into the component tree.
 */
export default function IKProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!urlEndpoint) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Publc Image ImageKit URL Endpoint is missing from environment."
      );
    }

    return <>{children}</>;
  }

  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>{children}</ImageKitProvider>
  );
}
