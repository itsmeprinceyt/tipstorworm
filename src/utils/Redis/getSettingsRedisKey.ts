import { getProduction } from "../Variables/getProduction.util";
import { getDBName } from "../Variables/getDBName.util";

export default function getRedisSettingsKey(): string {
  const value: boolean = getProduction();
  const dbName: string = getDBName();
  return `${dbName}:global_settings:${value}`;
}
