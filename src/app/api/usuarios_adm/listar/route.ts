import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function GET(req: NextRequest) {
  const codigo = req.nextUrl.searchParams.get("codigo");

  if (!codigo) {
    return NextResponse.json(
      { error: "Código institucional ausente" },
      { status: 400 },
    );
  }

  const client = await clientPromise;
  const db = client.db("roomly");

  const usuarios = await db
    .collection("usuarios")
    .find({
      tipo: "user",
      codigoInstitucional: { $in: [codigo] },
    })
    .project({ nome: 1, cpf: 1, email: 1, telefone: 1, cep: 1 })
    .toArray();

  return NextResponse.json({ usuarios });
}
