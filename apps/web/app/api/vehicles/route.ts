import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const required = ["chassisNumber", "brand", "model", "variant", "year", "costPrice", "sellingPrice"];
  const missing = required.filter((key) => body?.[key] === undefined || body?.[key] === null || body[key] === "");

  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  if (Number(body.year) < 1900 || Number(body.costPrice) < 0 || Number(body.sellingPrice) < 0) {
    return NextResponse.json({ error: "Invalid vehicle values" }, { status: 400 });
  }

  return NextResponse.json(
    {
      id: crypto.randomUUID(),
      ...body,
      year: Number(body.year),
      costPrice: Number(body.costPrice),
      sellingPrice: Number(body.sellingPrice),
      status: body.status || "available",
      createdAt: new Date().toISOString()
    },
    { status: 201 }
  );
}
