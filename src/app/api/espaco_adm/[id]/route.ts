import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const body = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "ID do espaço ausente" },
      { status: 400 },
    );
  }

  const client = await clientPromise;
  const db = client.db("roomly");

  const result = await db
    .collection("espacos")
    .updateOne({ _id: new ObjectId(id) }, { $set: body });

  if (result.modifiedCount === 0) {
    return NextResponse.json(
      { error: "Espaço não encontrado ou dados iguais" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json(
      { error: "ID do espaço ausente" },
      { status: 400 },
    );
  }

  const client = await clientPromise;
  const db = client.db("roomly");

  const result = await db.collection("espacos").deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 0) {
    return NextResponse.json(
      { error: "Espaço não encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}
