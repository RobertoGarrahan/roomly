"use client";
import React, { useRef } from "react";
import Txt from "../kit/Txt";
import { PiInstagramLogoBold } from "react-icons/pi";
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

const Page: React.FC = () => {
  const homeRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="w-full bg-blue text-blue-900">
      {/* Navbar */}
      <div className="container mx-auto flex w-full items-center justify-between p-5 lg:w-2/3">
        <div className="flex space-x-5">
          <a
            className="cursor-pointer text-black hover:text-gray-700"
            onClick={() => scrollToSection(homeRef)}
          >
            Home
          </a>
          <a
            className="cursor-pointer text-black hover:text-gray-700"
            onClick={() => scrollToSection(aboutRef)}
          >
            Sobre
          </a>
          <a
            className="cursor-pointer text-black hover:text-gray-700"
            onClick={() => scrollToSection(contactRef)}
          >
            Contato
          </a>
        </div>
        <a
          href="/login"
          className="inline-flex rounded bg-blue-900 px-4 py-2 text-sm text-white hover:bg-opacity-80 focus:outline-none"
        >
          Entrar
        </a>
      </div>

      {/* Seção 1 */}
      <section
        ref={homeRef}
        className="container mx-auto flex w-full flex-col items-center py-28 md:flex-row lg:w-2/3 px-4 lg:px-8"
      >
        <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:items-start lg:w-[75%] lg:flex-grow">
          <h1 className="mb-4 w-full text-left text-6xl font-bold sm:text-3xl md:text-6xl xl:text-7xl">
            Reserva de espaços para todo mundo
          </h1>

          <div className="mb-12 h-full min-h-[140px] text-left leading-relaxed text-gray-600">
            <Txt texto="O Roomly é um sistema inteligente para gerenciamento e reserva de espaços compartilhados. Ele permite que instituições, empresas e condomínios organizem e otimizem o uso de salas, auditórios, áreas de lazer e muito mais. Com uma interface intuitiva e fácil de usar, os usuários podem consultar a disponibilidade, realizar reservas em tempo real e gerenciar seus agendamentos de maneira prática. Tudo isso em uma única plataforma, acessível de qualquer dispositivo." />
          </div>
          <div className="flex w-full justify-start">
            <a
              href="/cadastro"
              className=" rounded bg-blue-900 px-4 py-2 text-sm text-white hover:bg-opacity-80 focus:outline-none"
            >
              Cadastre-se
            </a>
          </div>
        </div>
        <div
          id="pattern"
          className="w-[25%] bg-contain bg-no-repeat md:ml-40 xl:mr-16"
        ></div>
      </section>

      <svg className="m-0 p-0" viewBox="0 0 500 100">
        <path
          fill="rgb(30 58 138)"
          d="M 0,50 C 150,0 350,100 500,50 L 500,150 L 0,150 Z"
        ></path>
      </svg>

      {/* Seção 2 */}
      <section ref={aboutRef} className="my-0 bg-blue-900 py-24 text-white">
        <div className="z-90 container mx-auto flex w-full flex-col items-center px-5 md:flex-row lg:w-2/3">
          <div className="mr-2 flex flex-col items-start text-left lg:w-[50%]">
            <h2 className="mb-4 text-3xl font-bold">Espaços acadêmicos</h2>
            <p className="mb-4 leading-relaxed">
              Gerencie e reserve laboratórios, salas de aula e auditórios com
              facilidade e eficiência.
            </p>
          </div>
          <div
            className="ml-2 h-[250px] w-full rounded-2xl bg-cover bg-top lg:h-[350px] lg:w-[50%]"
            style={{
              backgroundImage: "url('/images/landing_page/college.jpg')",
              backgroundPosition: "top",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>

        <div className="container mx-auto mt-16 flex w-full flex-col-reverse items-center px-5 md:flex-row lg:w-2/3">
          <div
            className="mr-2 h-[250px] w-full rounded-2xl bg-cover bg-top lg:h-[350px] lg:w-[50%]"
            style={{
              backgroundImage: "url('/images/landing_page/restaurant.jpg')",
              backgroundPosition: "top",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="ml-2 flex w-full flex-col items-start text-left lg:w-[50%]">
            <h2 className="mb-4 text-3xl font-bold">Espaços de lazer</h2>
            <p className="mb-4 leading-relaxed">
              Reserve áreas como restaurantes, salões de festas ou espaços de
              convivência de maneira simples e rápida.
            </p>
          </div>
        </div>

        <div className="container mx-auto mt-16 flex w-full flex-col items-center px-5 md:flex-row lg:w-2/3">
          <div className="mr-2 flex w-full flex-col items-start text-left lg:w-[50%]">
            <h2 className="mb-4 text-3xl font-bold">
              Espaços médicos e hospitalares
            </h2>
            <p className="mb-4 leading-relaxed">
              Garanta a organização e a eficiência em ambientes hospitalares.
              Com o Roomly, é possível reservar salas de consulta, auditórios
              para treinamentos ou até mesmo áreas de convivência para
              profissionais da saúde. Tudo de forma prática e centralizada.
            </p>
          </div>
          <div
            className="ml-2 h-[250px] w-full rounded-2xl bg-cover bg-top lg:h-[350px] lg:w-[50%]"
            style={{
              backgroundImage: "url('/images/landing_page/hospital.jpg')",
              backgroundPosition: "top",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </section>

      {/* Footer */}
      <section ref={contactRef}>
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="flex w-full flex-col px-4 text-blue-900 md:w-2/3">
            <div className="w-full text-4xl font-bold lg:text-7xl">
              <h1 className="w-full md:w-2/3">
                Transformando a gestão de espaços compartilhados.
              </h1>
            </div>
            <div className="mt-8 flex flex-col md:flex-row md:justify-between">
              <p className="w-full text-black md:w-2/3">
                Estamos aqui para simplificar a gestão de espaços e tornar seu
                dia a dia mais eficiente. Entre em contato conosco e descubra
                como podemos ajudar.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="mb-12 mt-24 flex flex-row justify-between">
                <div className="flex flex-row text-black items-center justify-between space-x-8">
                  <FaTiktok />
                  <PiInstagramLogoBold />
                  <FaXTwitter />
                </div>
                <div
                  onClick={() => scrollToSection(homeRef)}
                  className="w-52 cursor-pointer pt-6 md:pt-0"
                >
                  <a className="flex items-center justify-center rounded-lg bg-blue-900 px-10 py-3 text-center font-bold text-white shadow">
                    Voltar ao topo
                  </a>
                </div>
              </div>
              <hr className="border-black" />
              <p className="my-12 w-full text-black text-center">Copyright © Roomly</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
