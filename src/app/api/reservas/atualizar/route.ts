import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function PUT(req: NextRequest) {
  const { reservaId, status } = await req.json();

  if (!reservaId || !status) {
    return NextResponse.json({ error: "Dados ausentes" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("roomly");

  const result = await db
    .collection("reservas")
    .updateOne({ _id: new ObjectId(reservaId) }, { $set: { status } });

  if (result.modifiedCount === 0) {
    return NextResponse.json(
      { error: "Reserva não encontrada ou status inalterado" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}
