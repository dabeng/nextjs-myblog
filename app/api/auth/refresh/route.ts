import jwt from 'jsonwebtoken';
import {
  errorHandler,
} from "_helpers/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json()

  if (!body.refreshToken) {
    throw new Error("refreshToken is required");
  }
  // Verify that the token is valid and not expired
  try {
    const decoded = jwt.verify(body.refreshToken, process.env.AUTH_SECRET);
    const id = decoded.sub as string;
    return NextResponse.json(jwt.sign({ sub: id }, process.env.AUTH_SECRET!, { expiresIn: '5s' }));
  } catch (err:any) {
    return errorHandler(err);
  }
}