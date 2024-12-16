import { NextResponse } from "next/server";
import getInfo from "@/db/providers/get-info";

export async function GET(){
    return NextResponse.json(await getInfo())
}