import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body?.name || !body?.phone) {
    return NextResponse.json(
      { error: "Customer name and phone are required" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      id: crypto.randomUUID(),
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || null,
      address: body.address?.trim() || null,
      createdAt: new Date().toISOString()
    },
    { status: 201 }
  );
}
