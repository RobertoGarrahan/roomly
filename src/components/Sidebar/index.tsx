"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { MdOutlineDashboard, MdOutlineWorkspaces } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "",
    menuItems: [
      {
        icon: <MdOutlineDashboard />,
        label: "Home",
        route: "/home_user",
        tipo: "user",
      },
      {
        icon: <MdOutlineDashboard />,
        label: "Home",
        route: "/home_adm",
        tipo: "admin",
      },
      {
        icon: <FaRegCalendarCheck />,
        label: "Reservas",
        route: "/reservas_user",
        tipo: "user",
      },
      {
        icon: <FaRegCalendarCheck />,
        label: "Reservas",
        route: "/reservas_adm",
        tipo: "admin",
      },
      {
        icon: <MdOutlineWorkspaces />,
        label: "Espaços",
        route: "/espaco_user",
        tipo: "user",
      },
      {
        icon: <MdOutlineWorkspaces />,
        label: "Espaços",
        route: "/espaco_adm",
        tipo: "admin",
      },
      {
        icon: <FaUsers />,
        label: "Usuários",
        route: "/usuarios_adm",
        tipo: "admin",
      },
      {
        icon: <CgProfile />,
        label: "Perfil",
        route: "/perfil_user",
        tipo: "user",
      },
      {
        icon: <CgProfile />,
        label: "Perfil",
        route: "/perfil_adm",
        tipo: "admin",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [tipo, setTipo] = useState<string | null>(null);
  const [carregandoTipo, setCarregandoTipo] = useState(true);

  useEffect(() => {
    const tipoSalvo = localStorage.getItem("tipo");
    setTipo(tipoSalvo);
    setCarregandoTipo(false);
  }, []);

  if (carregandoTipo) return null;

  // Atualiza dinamicamente sempre que tipo mudar
  const gruposFiltrados = menuGroups.map((group) => {
    const menuItemsFiltrados = group.menuItems.filter(
      (item) => item.tipo === tipo,
    );
    return { ...group, menuItems: menuItemsFiltrados };
  });

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/">
            <Image
              width={176}
              height={32}
              src={"/images/logo/logo_roomly_sem_bg.png"}
              alt="Logo"
              priority
            />
          </Link>
        </div>

        {/* Menu */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {gruposFiltrados.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
