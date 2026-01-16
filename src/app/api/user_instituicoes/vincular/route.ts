import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function POST(req: NextRequest) {
  const { userId, novoCodigo } = await req.json();

  if (!userId || !novoCodigo) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("roomly");

  await db.collection("usuarios").updateOne(
    { _id: new ObjectId(userId) },
    { $addToSet: { codigoInstitucional: novoCodigo } }
  );

  return NextResponse.json({ success: true });
}
