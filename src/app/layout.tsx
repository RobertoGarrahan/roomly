import "../css/satoshi.css";
import "../css/style.css";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import type { Metadata } from "next";
import ClientWrapper from "@/components/common/ClientWrapper";

export const metadata: Metadata = {
  title: "Roomly",
  description: "Roomly, reserva de espaços para todo mundo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
