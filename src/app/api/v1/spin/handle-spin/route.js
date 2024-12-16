import { NextResponse } from "next/server";
import handleSpin from "@/db/providers/handle-spin";

export async function POST(){
    return NextResponse.json(await handleSpin())
}