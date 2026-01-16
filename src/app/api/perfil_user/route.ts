import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo";

// GET - Buscar dados do usuário
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("roomly");

  try {
    const user = await db
      .collection("usuarios")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
}

// PUT - Atualizar dados do usuário
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, nome, email, telefone, cep, endereco } = body;

  const client = await clientPromise;
  const db = client.db("roomly");

  await db
    .collection("usuarios")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { nome, email, telefone, cep, endereco } },
    );

  return NextResponse.json({ success: true });
}
