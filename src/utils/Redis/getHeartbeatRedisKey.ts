import { getDBName } from "../Variables/getDBName";
import { getProduction } from "../Variables/getProduction"

export default function getHeartbeatRedisKey(): string {
    const value = getProduction();
    const dbName = getDBName();
    return `${dbName}:heartbeat_last_check:${value}`
}