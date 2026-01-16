import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "ID do usuário ausente" },
      { status: 400 },
    );
  }

  const client = await clientPromise;
  const db = client.db("roomly");

  const reservas = await db
    .collection("reservas")
    .find({ userId: new ObjectId(userId) })
    .toArray();

  return NextResponse.json({ reservas });
}
