"use client";
import { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { FaTrash } from "react-icons/fa";

const TableUsers = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [codigoAtual, setCodigoAtual] = useState<string | null>(null);

  const fetchUsuarios = async (codigo: string) => {
    const res = await fetch(`/api/usuarios_adm/listar?codigo=${codigo}`);
    const data = await res.json();
    setUsuarios(data.usuarios);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const codigo = Array.isArray(user.codigoInstitucional)
      ? user.codigoInstitucional[0]
      : user.codigoInstitucional;

    if (!codigo) return;
    setCodigoAtual(codigo);
    fetchUsuarios(codigo);
  }, []);

  const toast = useRef<Toast>(null);

  const removerVinculo = async (userId: string) => {
    if (!codigoAtual) return;

    const confirmar = window.confirm("Deseja realmente remover este vínculo?");
    if (!confirmar) return;

    const res = await fetch("/api/usuarios_adm/remover_vinculo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, codigoInstitucional: codigoAtual }),
    });

    const data = await res.json();

    if (data.success) {
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Vínculo removido com sucesso.",
        life: 3000,
      });
      fetchUsuarios(codigoAtual);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao remover vínculo.",
        life: 4000,
      });
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1">
      <Toast ref={toast} />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black">
                Nome
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black">
                CPF
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black">
                Email
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black">
                Celular
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black">
                CEP
              </th>
              <th className="min-w-[80px] px-4 py-4 font-medium text-black">
                Excluir
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user, key) => (
              <tr key={key}>
                <td className="border-b px-4 py-5">{user.nome}</td>
                <td className="border-b px-4 py-5">{user.cpf}</td>
                <td className="border-b px-4 py-5">{user.email}</td>
                <td className="border-b px-4 py-5">{user.telefone}</td>
                <td className="border-b px-4 py-5">{user.cep}</td>
                <td className="border-b px-4 py-5">
                  <button
                    className="text-red-600 hover:text-red-800"
                    title="Remover vínculo com instituição"
                    onClick={() => removerVinculo(user._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableUsers;
