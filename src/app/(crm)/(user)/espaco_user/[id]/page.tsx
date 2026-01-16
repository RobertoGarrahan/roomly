"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface Espaco {
  _id: string;
  nome: string;
  descricao: string;
  espacoImg?: string;
}

export default function InstituicaoEspacosPage({
  params,
}: {
  params: { id: string };
}) {
  const [espacoSelecionado, setEspacoSelecionado] = useState<any>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [dataReserva, setDataReserva] = useState<Date | null>(null);
  const [horario, setHorario] = useState("");

  const abrirModal = (espaco: any) => {
    setEspacoSelecionado(espaco);
    setMostrarModal(true);
  };

  //confirmar a solicitação de reserva
  const reservar = async () => {
    if (!dataReserva || !horario) return alert("Preencha todos os campos");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch("/api/reservas/criar/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        espacoId: espacoSelecionado._id,
        data: dataReserva,
        horario,
      }),
    });

    const response = await res.json();

    if (response.success) {
      toast.current?.show({
        severity: "success",
        summary: "Reserva Solicitada",
        detail: `Reserva de ${espacoSelecionado.nome} solicitada com sucesso!`,
        life: 5000,
      });
      setMostrarModal(false);
      setDataReserva(null);
      setHorario("");
    } else {
      alert("Erro ao solicitar reserva");
    }
  };

  const [espacos, setEspacos] = useState<Espaco[]>([]);

  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchEspacos = async () => {
      const res = await fetch(`/api/espaco_user/listar?codigo=${params.id}`);
      const data = await res.json();
      setEspacos(data.espacos);
    };

    fetchEspacos();
  }, [params.id]);

  return (
    <DefaultLayout>
      <Toast ref={toast} />
      <div className=" min-h-[80vh h-full max-h-[80vh] w-full overflow-y-auto rounded-3xl bg-white px-8 py-6 shadow-lg lg:px-18 lg:py-12">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">
          Espaços disponíveis
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {espacos.map((espaco) => (
            <div
              key={espaco._id}
              onClick={() => abrirModal(espaco)}
              className="cursor-pointer rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg"
            >
              <div
                className="relative flex h-[25vh] w-full flex-col justify-center overflow-hidden rounded-xl shadow-md"
                style={{
                  backgroundImage: `url(${espaco.espacoImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay escuro */}
                <div className="absolute inset-0 from-black/80 to-black/20 transition-all hover:bg-gradient-to-t"></div>
              </div>
              <h3 className="my-2 text-lg font-semibold text-blue-900">
                {espaco.nome}
              </h3>
              <p className="mt-2 text-gray-600">{espaco.descricao}</p>
            </div>
          ))}
        </div>
      </div>
      {/* modal de reserva */}
      {mostrarModal && espacoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[90%] max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-blue-900">
              Reservar: {espacoSelecionado.nome}
            </h2>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Data da Reserva
              </label>
              <Calendar
                value={dataReserva}
                onChange={(e) => setDataReserva(e.value as Date)}
                showIcon
                className="w-full"
                dateFormat="dd/mm/yy"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Horário
              </label>
              <input
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2"
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setMostrarModal(false)}
                className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={reservar}
                className="rounded bg-blue-900 px-4 py-2 text-white hover:bg-blue-800"
              >
                Solicitar Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
