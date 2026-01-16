// app/api/espaco_adm/adicionar/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    nome,
    localizacao,
    horario,
    capacidade,
    descricao,
    categoria,
    codigoInstitucional,
    espacoImg,
  } = body;

  if (
    !nome ||
    !localizacao ||
    !horario ||
    !capacidade ||
    !descricao ||
    !categoria ||
    !codigoInstitucional ||
    !espacoImg
  ) {
    return NextResponse.json(
      { error: "Campos obrigatórios faltando" },
      { status: 400 },
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("roomly");

    await db.collection("espacos").insertOne({
      nome,
      localizacao,
      horario,
      capacidade,
      descricao,
      categoria,
      codigoInstitucional,
      espacoImg,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar espaço:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
