import { NextResponse } from "next/server";
import getSpins from "@/db/providers/get-spins";

export async function GET(){
    return NextResponse.json(await getSpins())
}