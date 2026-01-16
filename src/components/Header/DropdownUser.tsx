"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiUser, FiLogOut } from "react-icons/fi";
import ClickOutside from "@/components/ClickOutside";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [perfilRoute, setPerfilRoute] = useState("/perfil_user");
  const router = useRouter();

  //ver o tipo de user logado
  useEffect(() => {
    const tipo = localStorage.getItem("tipo");
    if (tipo === "admin") setPerfilRoute("/perfil_adm");
    else setPerfilRoute("/perfil_user");
  }, []);

  //logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tipo");
    router.push("/login");
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-xl font-medium text-black dark:text-white">
            Perfil
          </span>
        </span>
        <Image
          width={40}
          height={32}
          src="/images/logo/logo_roomly_chair.png"
          alt="Logo"
          priority
          style={{ filter: "brightness(0%)" }}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                href={perfilRoute}
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <FiUser size={20} />
                Perfil
              </Link>
            </li>
          </ul>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <FiLogOut size={20} />
            Sair
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
