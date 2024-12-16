import { NextResponse } from "next/server";
import listen from "@/db/providers/bot";
listen()
export function GET(){
    return NextResponse.json({})
  }