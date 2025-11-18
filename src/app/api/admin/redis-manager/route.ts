/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

import { getRedis } from "../../../../lib/Redis/redis";
import { RedisKey } from "../../../../types/Admin/Redis/RedisKeyDate.type";
import { logAudit } from "../../../../utils/Variables/AuditLogger.util";

/**
 * @description
 * Redis cache management endpoints
 * - GET: Fetch all keys with TTL and handle different data types
 */
export async function GET(): Promise<NextResponse> {
  try {
    const currentUser = await getServerSession(authOptions);
    if (!currentUser || !currentUser.user.is_admin) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: You do not have permission to perform this action.",
        },
        { status: 403 }
      );
    }

    const redis = getRedis();

    const keys = await redis.keys("*");

    const BATCH_SIZE = 50;
    const keyData: RedisKey[] = [];

    for (let i = 0; i < keys.length; i += BATCH_SIZE) {
      const batchKeys = keys.slice(i, i + BATCH_SIZE);

      const batchData = await Promise.all(
        batchKeys.map(async (key): Promise<RedisKey> => {
          try {
            const type = await redis.type(key);
            const ttl = await redis.ttl(key);

            let value: any = null;
            let size = 0;

            switch (type) {
              case "string":
                value = await redis.get(key);
                try {
                  value = JSON.parse(value);
                } catch {
                  // Keep as string if not JSON
                }
                size = new TextEncoder().encode(JSON.stringify(value)).length;
                break;

              case "list":
                // Limit list items to prevent huge responses
                value = await redis.lrange(key, 0, 99);
                size = new TextEncoder().encode(JSON.stringify(value)).length;
                break;

              case "set":
                value = await redis.smembers(key);
                // Limit set members
                if (Array.isArray(value) && value.length > 100) {
                  value = value.slice(0, 100);
                }
                size = new TextEncoder().encode(JSON.stringify(value)).length;
                break;

              case "zset":
                value = await redis.zrange(key, 0, 99, { withScores: true });
                size = new TextEncoder().encode(JSON.stringify(value)).length;
                break;

              case "hash":
                value = await redis.hgetall(key);
                size = new TextEncoder().encode(JSON.stringify(value)).length;
                break;

              default:
                value = `Unsupported type: ${type}`;
                size = 0;
            }

            return {
              key,
              type,
              ttl,
              value,
              size,
            };
          } catch (error) {
            console.error(`Error processing key ${key}:`, error);
            return {
              key,
              type: "unknown",
              ttl: -2,
              value: `Error: Could not retrieve value`,
              size: 0,
            };
          }
        })
      );

      keyData.push(...batchData);
    }

    return NextResponse.json(
      {
        data: keyData,
        total: keyData.length,
        message:
          keys.length > 100
            ? "Results truncated to first 100 items for large collections"
            : undefined,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Failed to fetch Redis data:", error);
    return NextResponse.json(
      { error: "Server error: Could not fetch Redis data." },
      { status: 500 }
    );
  }
}

export async function POST(): Promise<NextResponse> {
  try {
    const currentUser = await getServerSession(authOptions);
    if (!currentUser || !currentUser.user.is_admin) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: You do not have permission to perform this action.",
        },
        { status: 403 }
      );
    }

    const redis = getRedis();
    await redis.flushdb();

    await logAudit(
      {
        user_id: currentUser.user.user_id!,
        email: currentUser.user.email!,
        name: currentUser.user.name!,
      },
      "system",
      `Admin ${currentUser.user.name} (${currentUser.user.email}) flushed Redis`
    );

    return NextResponse.json(
      { message: "Success: The Redis cache has been completely flushed." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Failed to flush Redis cache:", error);
    return NextResponse.json(
      { error: "Server error: Could not flush the Redis cache." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const currentUser = await getServerSession(authOptions);
    if (!currentUser || !currentUser.user?.is_admin) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: You do not have permission to perform this action.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Key parameter is required" },
        { status: 400 }
      );
    }

    const redis = getRedis();

    const exists = await redis.exists(key);
    if (exists === 0) {
      return NextResponse.json(
        { error: `Key "${key}" does not exist` },
        { status: 404 }
      );
    }

    await redis.del(key);

    console.log(
      `Redis key deleted by admin ${
        currentUser.user?.user_id || currentUser.user?.id
      }: ${key}`
    );
    return NextResponse.json(
      { message: `Success: Key "${key}" has been deleted.` },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Failed to delete Redis key:", error);
    return NextResponse.json(
      { error: "Server error: Could not delete the Redis key." },
      { status: 500 }
    );
  }
}
