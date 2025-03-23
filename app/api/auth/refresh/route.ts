import jwt from 'jsonwebtoken';
import {
  errorHandler,
} from "_helpers/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  authService,
} from "@/_auth/authService";

export async function POST(req: Request) {
  try {
    const token = await req.json();
    const accessToken = await authService.refresh(token.refreshToken);

    return NextResponse.json(accessToken);
  } catch (err:any) {
    return errorHandler(err);
  }
}