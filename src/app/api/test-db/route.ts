import { NextResponse } from "next/server";
import { initServer, db } from "../../../lib/initServer";

export async function GET(){
    await initServer();
    const pool = db();

    if(pool){
        return NextResponse.json({message: "Its working"}, {status: 200});
    } else {
        return NextResponse.json({error: "Database connection not found"}, {status: 404});
    }
}