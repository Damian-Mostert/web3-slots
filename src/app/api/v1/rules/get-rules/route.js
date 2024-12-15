import { NextResponse } from "next/server";
import getRules from "@/db/providers/get-rules";

export async function GET(){
    return NextResponse.json(await getRules())
}