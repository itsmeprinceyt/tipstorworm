export interface RouteAccessRowProps {
  id: number;
  routeKey: string;
  enabled: boolean;
  onToggleSuccess: () => void;
  onRequestRename: (oldKey: string, newKey: string) => void;
  onRequestDelete: (routeKey: string) => void;
}