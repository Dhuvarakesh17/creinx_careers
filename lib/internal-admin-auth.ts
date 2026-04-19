import crypto from "node:crypto";

import { NextResponse } from "next/server";

function parseAllowedOrigins() {
  return (process.env.ADMIN_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function secureEquals(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);

  if (aBuf.length !== bBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function getAdminApiKeyFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return request.headers.get("x-admin-api-key")?.trim() ?? "";
}

export function validateAdminRequest(request: Request) {
  const expectedKey = (process.env.INTERNAL_ADMIN_API_KEY ?? "").trim();
  if (!expectedKey) {
    return NextResponse.json(
      { message: "Server misconfigured: INTERNAL_ADMIN_API_KEY is missing." },
      { status: 500 },
    );
  }

  const receivedKey = getAdminApiKeyFromRequest(request);
  if (!receivedKey || !secureEquals(receivedKey, expectedKey)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const allowedOrigins = parseAllowedOrigins();
  const requestOrigin = request.headers.get("origin");
  if (
    allowedOrigins.length > 0 &&
    requestOrigin &&
    !allowedOrigins.includes(requestOrigin)
  ) {
    return NextResponse.json(
      { message: "Origin not allowed" },
      { status: 403 },
    );
  }

  return null;
}

export function withAdminCors(request: Request, response: NextResponse) {
  const requestOrigin = request.headers.get("origin") ?? "";
  const allowedOrigins = parseAllowedOrigins();

  const allowOrigin =
    allowedOrigins.length === 0
      ? requestOrigin || "*"
      : allowedOrigins.includes(requestOrigin)
        ? requestOrigin
        : allowedOrigins[0];

  response.headers.set("Access-Control-Allow-Origin", allowOrigin);
  response.headers.set("Vary", "Origin");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Admin-Api-Key",
  );

  return response;
}

export function handleAdminOptions(request: Request) {
  return withAdminCors(request, new NextResponse(null, { status: 204 }));
}
