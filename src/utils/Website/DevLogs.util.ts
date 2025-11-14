import { DevLog } from "../../types/Website/DevLogs.type";

/**
 * Development logs data - manually maintained changelog
 * Sorted by ID in descending order (newest first)
 */
export const devLogsData: DevLog[] = [
  {
    id: "4",
    title: "Security & Profile Updates",
    description: "Security and profile updates",
    date: "2025-11-14",
    version: "v1.2.2",
    changes: [
      "Updated security to enhance checking data being sent back when editing profile",
      "Added feature to view user's profile via username",
      "Added middleware",
    ],
  },
  {
    id: "3",
    title: "More Customization to profile",
    description:
      "Added ImageKit so now everyone can update their cover photos and edit their profile",
    date: "2025-11-13",
    version: "v1.2.1",
    changes: [
      "Integrated ImageKit",
      "Added feature to change profile visibility",
      "Added feature to update username",
      "Added feature to update bio",
      "Added feature to update special website url",
      "Added feature to modify cover photo",
    ],
  },
  {
    id: "2",
    title: "Admin Dashboard & Management",
    description:
      "Enhanced admin capabilities with comprehensive management panels and system monitoring",
    date: "2025-11-02",
    version: "v1.2.0",
    changes: [
      "User profile dashboard with activity tracking",
      "Complete audit logging system for security monitoring",
      "System heartbeat and health monitoring logic",
      "Redis integration for caching and session management",
      "Redis cache management interface",
      "Categories management system with CRUD operations",
      "Added footer",
      "Added public dev logs for users to see",
    ],
  },
  {
    id: "1",
    title: "Authentication & Platform Foundation",
    description:
      "Established core authentication system and initial platform structure",
    date: "2025-10-28",
    version: "v1.1.0",
    changes: [
      "Secure login and authentication system",
      "Invite token generation and management",
      "Landing page with hero section",
      "Brand identity and logo design",
      "User registration flow",
      "Basic admin permissions system",
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
