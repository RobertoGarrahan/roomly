"use client";
import { useEffect, useState } from "react";

const TableReservas = () => {
  const [reservas, setReservas] = useState<any[]>([]);

  useEffect(() => {
    const fetchReservas = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`/api/reservas_user/listar?userId=${user.id}`);
      const data = await res.json();
      setReservas(data.reservas);
    };

    fetchReservas();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Instituição</th>
            <th className="px-4 py-2">Local</th>
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2">Horário</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva, idx) => (
            <tr key={idx} className="border-b">
              <td className="px-4 py-2">{reserva.nomeInstituicao}</td>
              <td className="px-4 py-2">{reserva.nomeEspaco}</td>
              <td className="px-4 py-2">
                {new Date(reserva.data).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{reserva.horario}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-block w-1/2 rounded-full px-4 py-1 text-center text-sm font-semibold uppercase text-white ${
                    reserva.status === "aprovada"
                      ? "bg-green-500"
                      : reserva.status === "reprovada"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }`}
                >
                  {reserva.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableReservas;
