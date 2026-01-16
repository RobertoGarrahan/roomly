"use client";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import React, { useState, useEffect, useRef } from "react";
import { FileUpload } from "primereact/fileupload";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Toast } from "primereact/toast";

const PerfilAdm = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [codigoInstitucional, setCodigoInstitucional] = useState("");
  const [categoria, setCategoria] = useState("");
  const [bio, setBio] = useState("");
  const [perfilImg, setPerfilImg] = useState(null);

  //pegar endereço com cep
  const buscarEndereco = async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        const enderecoFormatado = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        setEndereco(enderecoFormatado);
      } else {
        setEndereco("CEP não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar endereço:", err);
      setEndereco("Erro ao buscar endereço.");
    }
  };

  //useEffect e buscar dados
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Usuário carregado do localStorage:", user);
    if (user?.id) {
      setUserId(user.id);
      fetchPerfil(user.id);
    }
  }, []);

  const fetchPerfil = async (id: string) => {
    const res = await fetch("/api/perfil_adm", {
      method: "GET",
      headers: { "user-id": id },
    });

    const data = await res.json();
    setNome(data.nome || "");
    setEmail(data.email || "");
    setCnpj(data.cnpj || "");
    setTelefone(data.telefone || "");
    setCep(data.cep || "");
    setEndereco(data.endereco || "");
    setCodigoInstitucional(data.codigoInstitucional || "");
    setCategoria(data.categoria || "");
    setBio(data.bio || "");
    setPerfilImg(data.imagem || "");
  };

  const toast = useRef<Toast>(null);

  //salvar as alterações
  const salvarAlteracoes = async () => {
    const res = await fetch("/api/perfil_adm", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userId,
        nome,
        email,
        telefone,
        cep,
        endereco,
        bio,
        perfilImg,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.current?.show({
        severity: "success",
        summary: "Sucesso!",
        detail: "Alterações salvas com sucesso.",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao salvar alterações.",
        life: 4000,
      });
    }
  };

  useProtectedRoute("admin");
  return (
    <DefaultLayout>
      <div className="h-full min-h-[80vh] w-full overflow-y-auto rounded-3xl bg-white px-8 py-16 shadow-lg lg:px-18">
        <Toast ref={toast} />
        <h2 className="mb-12 text-xl font-semibold text-gray-800">
          Perfil - Código: {codigoInstitucional || "Carregando..."}
        </h2>

        <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Nome */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              placeholder={nome || "Nome da Instituição"}
              onChange={(e) => setNome(e.target.value)}
              className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2"
            />
          </div>

          {/* CNPJ */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              CNPJ
            </label>
            <input
              type="text"
              placeholder={cnpj || "00.000.000/0000-00"}
              className="cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-500"
              disabled
            />
          </div>

          {/* Telefone */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="tel"
              placeholder={telefone || "(00) 00000-0000"}
              onChange={(e) => setTelefone(e.target.value)}
              className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder={email || "seu@email.com"}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2"
            />
          </div>

          {/* CEP */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              CEP
            </label>
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={buscarEndereco}
              placeholder={cep || "00000-000"}
              className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2"
            />
          </div>

          {/* Endereço */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder={endereco || "Rua, número, bairro, cidade"}
              className="rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2"
            />
          </div>
        </form>

        {/* descrição da Instituição */}
        <div className="col-span-2 flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Sobre a instituição
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={bio || "Descrição da Instituição"}
            rows={4}
            className="resize-none rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2"
          />
        </div>

        {/* Campo de adicionar foto */}
        <div className="mt-8">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Foto de Perfil
          </label>
          {perfilImg ? (
            <img src={perfilImg} width={250} />
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

                  const imageUrl = data.secure_url;
                  console.log("Imagem enviada:", imageUrl);

                  setPerfilImg(imageUrl);

                  const user = JSON.parse(localStorage.getItem("user") || "{}");

                  await fetch("/api/perfil_adm/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: user.id,
                      imageUrl: imageUrl,
                    }),
                  });
                } catch (err) {
                  console.error("Erro ao enviar imagem:", err);
                  alert("Erro ao subir imagem.");
                }
              }}
              className="w-full cursor-pointer rounded border border-gray-300 p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-900 file:px-4 file:py-2 file:text-white hover:file:bg-blue-800"
            />
          )}
        </div>

        {/* Botão salvar */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={salvarAlteracoes}
            className="w-full rounded-lg bg-blue-900 px-6 py-2 font-medium text-white transition hover:bg-blue-800"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PerfilAdm;
