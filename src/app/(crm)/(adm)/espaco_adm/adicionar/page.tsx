"use client";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { MdOutlinePool } from "react-icons/md";
import { GiBarbecue, GiTeacher } from "react-icons/gi";
import { LuPartyPopper, LuSpeech, LuFerrisWheel } from "react-icons/lu";
import { IoLibrary } from "react-icons/io5";
import {
  FaMicroscope,
  FaUtensils,
  FaStore,
  FaHospital,
  FaPen,
} from "react-icons/fa";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";

const spaceOptions = [
  { id: 1, label: "Piscina", icon: <MdOutlinePool size={36} /> },
  { id: 2, label: "Churrasqueira", icon: <GiBarbecue size={36} /> },
  { id: 3, label: "Salão de Festa", icon: <LuPartyPopper size={36} /> },
  { id: 4, label: "Sala de Aula", icon: <GiTeacher size={36} /> },
  { id: 5, label: "Biblioteca", icon: <IoLibrary size={36} /> },
  { id: 6, label: "Laboratório", icon: <FaMicroscope size={36} /> },
  { id: 7, label: "Mesa de Restaurante", icon: <FaUtensils size={36} /> },
  { id: 8, label: "Auditório", icon: <LuSpeech size={36} /> },
  { id: 9, label: "Brinquedo", icon: <LuFerrisWheel size={36} /> },
  { id: 10, label: "Estande", icon: <FaStore size={36} /> },
  { id: 11, label: "Quarto de Hospital", icon: <FaHospital size={36} /> },
  { id: 12, label: "Outros", icon: <FaPen size={36} /> },
];

export default function AddEspaco() {
  const [nome, setNome] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [horario, setHorario] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const toast = useRef<Toast>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (
      !nome ||
      !localizacao ||
      !horario ||
      !capacidade ||
      !descricao ||
      !categoria ||
      !imageFile
    ) {
      alert("Insira os dados e selecine a categoria para continuar!");
      return;
    }
    let imageUrl = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
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
          throw new Error(data.error?.message || "Erro no upload");
        }

        imageUrl = data.secure_url;
      } catch (err) {
        console.error("Erro ao enviar imagem para Cloudinary:", err);
        alert("Erro ao enviar imagem.");
        return;
      }
    }

    const body = {
      nome,
      localizacao,
      horario,
      capacidade,
      descricao,
      categoria,
      codigoInstitucional: user?.codigoInstitucional || "",
      espacoImg: imageUrl,
    };

    try {
      const res = await fetch("/api/espaco_adm/adicionar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Espaço adicionado com sucesso!",
          life: 3000,
        });

        // limpar estados
        setNome("");
        setLocalizacao("");
        setHorario("");
        setCapacidade("");
        setDescricao("");
        setCategoria("");
        setImageFile(null);
        setPreview(null);

        router.push("/home_adm");
      } else {
        alert("Erro ao salvar espaço.");
      }
    } catch (err) {
      console.error("Erro ao enviar dados para API:", err);
      alert("Erro ao salvar espaço.");
    }
  };

  return (
    <DefaultLayout>
      <Toast ref={toast} />
      <div className="h-full min-h-[80vh] w-full rounded-3xl bg-white p-6 shadow-lg lg:px-18 lg:py-12">
        <h2 className="mb-6 text-left font-[Comfortaa] text-2xl font-semibold">
          Adicionar Novo Espaço
        </h2>
        <div className="grid min-h-[60vh] gap-6 py-10 lg:grid-cols-2">
          <div className="flex flex-col space-y-4 border-r pr-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {spaceOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setCategoria(option.label)}
                  className={`flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-3xl ${categoria === option.label ? "bg-blue-200" : "bg-gray-100"} shadow-sm transition hover:bg-gray-200`}
                >
                  <span className="text-gray-700">{option.icon}</span>
                  <span className="mt-2 text-center font-[Poppins] text-sm font-medium text-gray-700">
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-4 font-[Poppins]">
            <input
              type="text"
              placeholder="Nome do espaço"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="text"
              placeholder="Localização"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Horário de Funcionamento"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                className="w-1/2 rounded-lg border p-3"
              />
              <input
                type="text"
                placeholder="Capacidade Máxima"
                value={capacidade}
                onChange={(e) => setCapacidade(e.target.value)}
                className="w-1/2 rounded-lg border p-3"
              />
            </div>
            <textarea
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="h-24 w-full rounded-lg border p-3"
            />
            <div
              onClick={() => inputRef.current?.click()}
              className="flex h-40 w-full cursor-pointer items-center justify-center rounded-lg bg-gray-200 text-gray-500"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={inputRef}
                className="hidden"
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Pré-visualização"
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                "Imagem do espaço"
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-between font-[Poppins]">
          <Link href="/espaco_adm">
            <button className="text-black hover:underline">Voltar</button>
          </Link>
          <button
            onClick={handleSubmit}
            className="flex items-center text-black hover:underline"
          >
            Adicionar
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
}
