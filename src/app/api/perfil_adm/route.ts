import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

// GET - Buscar perfil
export async function GET(req: Request) {
  const userId = req.headers.get("user-id");
  if (!userId)
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("roomly");

  const instituicao = await db
    .collection("instituicoes")
    .findOne({ adminId: new ObjectId(userId) });

  if (!instituicao) {
    return NextResponse.json(
      { error: "Instituição não encontrada" },
      { status: 404 },
    );
  }

  return NextResponse.json(instituicao);
}

// PUT - Atualizar perfil
export async function PUT(req: Request) {
  const { id, nome, email, telefone, cep, endereco, bio, perfilImg } =
    await req.json();
  console.log(perfilImg);
  const client = await clientPromise;
  const db = client.db("roomly");

  await db
    .collection("instituicoes")
    .updateOne(
      { adminId: new ObjectId(id) },
      {
        $set: { nome, email, telefone, cep, endereco, bio, imagem: perfilImg },
      },
    );

  return NextResponse.json({ success: true });
}
