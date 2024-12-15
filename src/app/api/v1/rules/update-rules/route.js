import { NextResponse } from "next/server";
import updateRules from "@/db/providers/update-rules";

export async function POST(request){
    return NextResponse.json(await updateRules(await request.json()))
}