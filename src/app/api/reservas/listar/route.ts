import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

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

  const espacos = await db
    .collection("espacos")
    .find({ codigoInstitucional: codigo })
    .toArray();
  const espacoIds = espacos.map((e) => e._id);

  const reservas = await db
    .collection("reservas")
    .find({ espacoId: { $in: espacoIds } })
    .toArray();

  const enrichedReservas = await Promise.all(
    reservas.map(async (reserva) => {
      const usuario = await db
        .collection("usuarios")
        .findOne({ _id: reserva.userId });
      const espaco = await db
        .collection("espacos")
        .findOne({ _id: reserva.espacoId });

      return {
        _id: reserva._id.toString(),
        nomeUsuario: usuario?.nome || "Desconhecido",
        cpf: usuario?.cpf || "-",
        email: usuario?.email || "-",
        nomeEspaco: espaco?.nome || "Espaço não encontrado",
        data: reserva.data,
        horario: reserva.horario,
        status: reserva.status,
      };
    }),
  );

  return NextResponse.json({ reservas: enrichedReservas });
}
