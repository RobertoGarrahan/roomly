import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  const { userId, espacoId, data, horario } = await req.json();
  console.log(" Dados recebidos no back:", {
    userId,
    espacoId,
    data,
    horario,
  });

  if (!userId || !espacoId || !data || !horario) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("roomly");

  // Buscar o espaço
  const espaco = await db
    .collection("espacos")
    .findOne({ _id: new ObjectId(espacoId) });
  console.log("Espaço encontrado:", espaco);
  if (!espaco) {
    return NextResponse.json(
      { error: "Espaço não encontrado" },
      { status: 404 },
    );
  }

  // Buscar a instituição vinculada ao espaço
  const instituicao = await db.collection("instituicoes").findOne({
    codigoInstitucional: { $in: espaco.codigoInstitucional },
  });

  console.log("Instituição encontrada:", instituicao);
  if (!instituicao) {
    return NextResponse.json(
      { error: "Instituição não encontrada" },
      { status: 404 },
    );
  }

  // Criar reserva com nomes
  const reserva = {
    userId: new ObjectId(userId),
    espacoId: new ObjectId(espacoId),
    nomeEspaco: espaco.nome,
    nomeInstituicao: instituicao.nome,
    data,
    horario,
    status: "pendente",
    solicitadaEm: new Date(),
  };

  await db.collection("reservas").insertOne(reserva);

  return NextResponse.json({ success: true });
}
