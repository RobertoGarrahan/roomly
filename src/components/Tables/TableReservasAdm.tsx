"use client";
import { useEffect, useState, useRef } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Toast } from "primereact/toast";

const TableReservas = () => {
  const [reservas, setReservas] = useState<any[]>([]);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchReservas = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const codigo = Array.isArray(user.codigoInstitucional)
        ? user.codigoInstitucional[0]
        : user.codigoInstitucional;

      const res = await fetch(`/api/reservas/listar?codigo=${codigo}`);
      const data = await res.json();
      setReservas(data.reservas);
    };

    fetchReservas();
  }, []);

  const atualizarStatus = async (reservaId: string, novoStatus: string) => {
    const res = await fetch("/api/reservas/atualizar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservaId, status: novoStatus }),
    });

    const data = await res.json();

    if (data.success) {
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: `Reserva ${novoStatus} com sucesso!`,
        life: 3000,
      });

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const codigo = Array.isArray(user.codigoInstitucional)
        ? user.codigoInstitucional[0]
        : user.codigoInstitucional;

      const resAtualizado = await fetch(
        `/api/reservas/listar?codigo=${codigo}`,
      );
      const dataAtualizado = await resAtualizado.json();
      setReservas(dataAtualizado.reservas);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao atualizar reserva",
        life: 3000,
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <Toast ref={toast} />
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">CPF</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Local</th>
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2">Horário</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r, key) => (
            <tr key={key} className="border-b">
              <td className="px-4 py-2">{r.nomeUsuario}</td>
              <td className="px-4 py-2">{r.cpf}</td>
              <td className="px-4 py-2">{r.email}</td>
              <td className="px-4 py-2">{r.nomeEspaco}</td>
              <td className="px-4 py-2">
                {new Date(r.data).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{r.horario}</td>
              <td className="px-4 py-2">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold uppercase text-white ${
                    r.status === "aprovada"
                      ? "bg-green-600"
                      : r.status === "reprovada"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                  }`}
                >
                  {r.status}
                </span>
              </td>
              <td className="flex gap-2 px-4 py-2">
                <button
                  onClick={() => atualizarStatus(r._id, "aprovada")}
                  className="hover:text-green-600"
                  title="Aprovar"
                >
                  <FaCheckCircle size={18} />
                </button>
                <button
                  onClick={() => atualizarStatus(r._id, "reprovada")}
                  className="hover:text-red-600"
                  title="Reprovar"
                >
                  <FaTimesCircle size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableReservas;
