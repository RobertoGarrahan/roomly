"use client";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { FaEdit } from "react-icons/fa";

interface Espaco {
  _id: string;
  nome: string;
  localizacao: string;
  descricao: string;
  categoria?: string;
  capacidade?: number;
  horario?: string;
  imagem?: string;
  espacoImg?: string;
}

export default function EspacoAdmPage() {
  const toast = useRef<Toast>(null);
  const [espacos, setEspacos] = useState<Espaco[]>([]);
  const [espacoSelecionado, setEspacoSelecionado] = useState<Espaco | null>(
    null,
  );

  const [nome, setNome] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [capacidade, setCapacidade] = useState<number>(0);
  const [horario, setHorario] = useState("");
  const [categoria, setCategoria] = useState("");
  const [espacoImg, setEspacoImg] = useState(null);

  useEffect(() => {
    if (espacoSelecionado) {
      setNome(espacoSelecionado.nome);
      setLocalizacao(espacoSelecionado.localizacao);
      setDescricao(espacoSelecionado.descricao);
      setCapacidade(espacoSelecionado.capacidade || 0);
      setHorario(espacoSelecionado.horario || "");
      setCategoria(espacoSelecionado.categoria || "");
    }
  }, [espacoSelecionado]);

  const handleOpenModal = (espaco: any) => {
    console.log("Espaço selecionado:", espaco);
    setEspacoSelecionado(espaco);
  };

  const handleCloseModal = () => setEspacoSelecionado(null);

  const showSuccessAlt = () => {
    toast.current?.show({
      severity: "success",
      summary: "Sucesso",
      detail: "Alterações salvas com sucesso!",
      life: 3000,
    });
  };

  const showSuccessExc = () => {
    toast.current?.show({
      severity: "success",
      summary: "Sucesso",
      detail: "Espaço excluído com sucesso!",
      life: 3000,
    });
  };

  //buscar espaços
  useEffect(() => {
    const fetchEspacos = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(
        `/api/espaco_adm/listar?codigo=${user.codigoInstitucional}`,
      );
      const data = await res.json();
      setEspacos(data.espacos);
    };
    fetchEspacos();
  }, []);

  //editar espaço
  const handleEditar = async () => {
    if (!espacoSelecionado?._id) return alert("ID do espaço não encontrado");

    const res = await fetch(`/api/espaco_adm/${espacoSelecionado._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        localizacao,
        descricao,
        capacidade,
        horario,
        tipo: categoria,
      }),
    });

    const data = await res.json();

    if (data.success) {
      showSuccessAlt();
      setEspacoSelecionado(null);

      // Atualizar a listagem de espaços
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const resAtualizado = await fetch(
        `/api/espaco_adm/listar?codigo=${user.codigoInstitucional}`,
      );
      const dataAtualizado = await resAtualizado.json();
      setEspacos(dataAtualizado.espacos);
    } else {
      alert("Erro ao editar espaço.");
    }
  };

  // Excluir espaço
  const handleExcluir = async () => {
    if (!espacoSelecionado?._id) return alert("ID do espaço não encontrado");

    const confirm = window.confirm(
      "Tem certeza que deseja excluir este espaço?",
    );
    if (!confirm) return;

    const res = await fetch(`/api/espaco_adm/${espacoSelecionado._id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      showSuccessExc();
      setEspacoSelecionado(null);

      // Atualizar lista
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const resAtualizado = await fetch(
        `/api/espaco_adm/listar?codigo=${user.codigoInstitucional}`,
      );
      const dataAtualizado = await resAtualizado.json();
      setEspacos(dataAtualizado.espacos);
    } else {
      alert("Erro ao excluir espaço.");
    }
  };

  // Recarrega os espaços após alteração
  const atualizarLista = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const res = await fetch(
      `/api/espacos/listar?codigoInstitucional=${user.codigoInstitucional}`,
    );
    const data = await res.json();
    setEspacos(data.espacos);
  };

  useProtectedRoute("admin");
  return (
    <DefaultLayout>
      <Toast ref={toast} />
      <div className="flex h-full max-h-[80vh] min-h-[80vh] w-full flex-col justify-between overflow-scroll rounded-3xl bg-white p-6 px-8 shadow-lg lg:px-18 lg:py-12">
        {/* Parte de cima: Card para adicionar novo espaço */}
        <div className="flex h-[80vh] w-full items-center justify-center border-b border-gray-300">
          <Link href="/espaco_adm/adicionar">
            <div className="flex h-40 w-64 cursor-pointer flex-col items-center justify-center bg-white p-6 transition ">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-800 text-blue-800">
                <span className="text-2xl font-bold">+</span>
              </div>
              <p className="mt-3 text-center text-sm font-medium text-gray-700">
                Adicionar novo espaço
              </p>
            </div>
          </Link>
        </div>

        {/* Espaçamento */}
        <div className="my-8"></div>

        {/* Parte de baixo: Lista de espaços */}
        <div className="grid grid-cols-1 gap-6 overflow-scroll py-6 md:grid-cols-2 lg:grid-cols-3">
          {espacos.map((espaco) => (
            <div
              key={espaco._id}
              onClick={() => handleOpenModal(espaco)}
              className="relative cursor-pointer rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-900">
                      {espaco.nome}
                    </h3>
                    <FaEdit className="text-blue-800" />
                  </div>
                  <p className="mt-2 text-gray-600">{espaco.localizacao}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {espacoSelecionado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-h-[90vh] w-[90%] max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-blue-900">
                {espacoSelecionado.nome}
              </h2>

              {/* tipo de espaço */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tipo de Espaço
                </label>
                <select
                  value={espacoSelecionado.categoria || ""}
                  onChange={(e) =>
                    setEspacoSelecionado({
                      ...espacoSelecionado,
                      categoria: e.target.value,
                    })
                  }
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2"
                >
                  <option value="">Selecione</option>
                  <option value="Piscina">Piscina</option>
                  <option value="Sala">Sala</option>
                  <option value="Auditório">Auditório</option>
                  <option value="Laboratório">Laboratório</option>
                  <option value="Quadra">Quadra</option>
                  <option value="Campo">Campo</option>
                  <option value="Biblioteca">Biblioteca</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="mb-4 flex gap-4">
                {/* nome */}
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nome do Espaço
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2"
                  />
                </div>

                {/* localização */}
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={espacoSelecionado.localizacao}
                    onChange={(e) =>
                      setEspacoSelecionado({
                        ...espacoSelecionado,
                        localizacao: e.target.value,
                      })
                    }
                    className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

              <div className="mb-4 flex gap-4">
                {/* capacidade */}
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Capacidade
                  </label>
                  <input
                    type="number"
                    value={espacoSelecionado.capacidade || ""}
                    onChange={(e) =>
                      setEspacoSelecionado({
                        ...espacoSelecionado,
                        capacidade: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2"
                  />
                </div>

                {/* horario */}
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    value={espacoSelecionado.horario}
                    onChange={(e) =>
                      setEspacoSelecionado({
                        ...espacoSelecionado,
                        horario: e.target.value,
                      })
                    }
                    className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

              {/* descrição */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  placeholder="Descrição"
                  value={espacoSelecionado.descricao}
                  onChange={(e) =>
                    setEspacoSelecionado({
                      ...espacoSelecionado,
                      descricao: e.target.value,
                    })
                  }
                  className="h-24 w-full rounded-lg border p-3"
                />
              </div>

              {/* foto */}
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Foto do local
                </label>
                {espacoSelecionado.espacoImg ? (
                  <img src={espacoSelecionado.espacoImg} width={250} />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("upload_preset", "roomly_uploads");

                      try {
                        const res = await fetch(
                          `https://api.cloudinary.com/v1_1/dxsw9fewd/image/upload`,
                          {
                            method: "POST",
                            body: formData,
                          },
                        );

                        const data = await res.json();

                        if (!res.ok) {
                          console.error("Erro Cloudinary:", data);
                          alert("Erro ao subir imagem.");
                          return;
                        }

                        console.log("Imagem enviada:", data.secure_url);
                        setEspacoImg(data.secure_url);
                      } catch (err) {
                        console.error("Erro ao enviar imagem:", err);
                        alert("Erro ao subir imagem.");
                      }
                    }}
                    className="w-full cursor-pointer rounded border border-gray-300 p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-900 file:px-4 file:py-2 file:text-white hover:file:bg-blue-800"
                  />
                )}
              </div>

              {/* Botões */}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleExcluir}
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Excluir
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={handleEditar}
                    className="rounded bg-blue-900 px-4 py-2 text-white hover:bg-blue-800"
                  >
                    Salvar alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
