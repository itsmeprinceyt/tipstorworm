export interface SocialPlatform {
  name: "instagram" | "youtube";
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  gradient: string;
  hoverGradient: string;
  title: string;
  subtitle: string;
  pingColor: string;
}

export interface HideUntilData {
  timestamp: number;
  duration: number;
}
