import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function POST(req: NextRequest) {
  const { userId, codigoInstitucional } = await req.json();

  if (!userId || !codigoInstitucional) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("roomly");

  const result = await db.collection("usuarios").updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { codigoInstitucional: codigoInstitucional } }
  );

  return NextResponse.json({ success: result.modifiedCount > 0 });
}
