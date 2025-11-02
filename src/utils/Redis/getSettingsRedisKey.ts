import { getProduction } from "../Variables/getProduction";
import { getDBName } from "../Variables/getDBName";

export default function getRedisSettingsKey(): string {
    const value: boolean = getProduction();
    const dbName: string = getDBName();
    return `${dbName}:global_settings:${value}`;
}