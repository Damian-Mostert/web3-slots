import { NextResponse } from "next/server";
import "@/db/providers/bot";

export function GET(){
    return NextResponse.json({})
  }