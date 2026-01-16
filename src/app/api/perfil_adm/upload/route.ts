import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { id, imageUrl } = await req.json();

    if (!id || !imageUrl) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("roomly");

    await db
      .collection("instituicoes")
      .updateOne({ adminId: new ObjectId(id) }, { $set: { imagem: imageUrl } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao salvar imagem:", err);
    return NextResponse.json(
      { error: "Erro ao salvar imagem" },
      { status: 500 },
    );
  }
}
