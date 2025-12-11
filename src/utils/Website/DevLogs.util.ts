import { DevLog } from "../../types/Website/DevLogs.type";

/**
 * Development logs data - public friendly changelog
 * Sorted by ID in descending order (newest first)
 */
export const devLogsData: DevLog[] = [
  {
    id: "6",
    title: "Token Raffle System",
    description:
      "We've launched a token raffle system! Now you can get an invite code to sign up - one code available every 24 hours, refreshing when used.",
    date: "2025-12-12",
    version: "v1.4.0",
    changes: [
      "Added token raffle page for invite code generation"
    ],
  },
  {
    id: "5",
    title: "Suggestions Feature Added",
    description:
      "You can now share your ideas and suggestions directly with us! Help shape future features by submitting anything you want to see.",
    date: "2025-12-01",
    version: "v1.3.0",
    changes: [
      "Added suggestions panel for all users",
      "Introduced a simple way to submit ideas or improvements",
    ],
  },
  {
    id: "4",
    title: "Profile Improvements",
    description:
      "We improved the profile system to make it safer and easier to browse and view user profiles.",
    date: "2025-11-14",
    version: "v1.2.2",
    changes: [
      "Better protection and handling of profile data",
      "You can now view someone's profile using their username",
      "General improvements for smoother experience",
    ],
  },
  {
    id: "3",
    title: "Better Profile Customization",
    description:
      "Profiles now feel more personal — you can update your cover photo, bio, username, and more!",
    date: "2025-11-13",
    version: "v1.2.1",
    changes: [
      "Upload & update cover photos",
      "Edit your username",
      "Edit your bio",
      "Control who can view your profile",
      "Add a personal website link",
    ],
  },
  {
    id: "2",
    title: "Admin & Platform Enhancements",
    description:
      "We polished the platform with better management tools, improved browsing, and a cleaner interface.",
    date: "2025-11-02",
    version: "v1.2.0",
    changes: [
      "Better user management for admins",
      "Improved categories system",
      "Added footer and other design improvements",
      "Added public development logs you’re reading now",
    ],
  },
  {
    id: "1",
    title: "Platform Launched!",
    description:
      "We launched the platform with login, sign-up, profiles, and the basic foundation of everything!",
    date: "2025-10-28",
    version: "v1.1.0",
    changes: [
      "User login & sign-up",
      "Invite-based registration",
      "Homepage published",
      "Branding and logo added",
      "Basic admin controls",
    ],
  },
];

/**
 * Fetches development logs sorted by ID (descending order)
 * Simulates API call with loading delay
 */
export const getDevLogs = async (): Promise<DevLog[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return devLogsData.sort((a, b) => parseInt(b.id) - parseInt(a.id));
};
