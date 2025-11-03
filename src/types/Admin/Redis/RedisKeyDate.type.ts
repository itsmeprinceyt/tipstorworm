/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RedisKey {
  key: string;
  type: string;
  ttl: number;
  value: any;
  size: number;
}

export interface DeleteModalState {
  isOpen: boolean;
  keyToDelete: string | null;
  isBulk: boolean;
}

export interface ExpandedKeys {
  [key: string]: boolean;
}