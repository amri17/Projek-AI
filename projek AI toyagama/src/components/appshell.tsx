"use client";

"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

import Navbar from "@/app/navbar";
import Sidebar from "@/components/sidebar";
/* =========================================================
   ROUTING CONTEXT
   ========================================================= */

type RoutingContextType = {
  selectedDestination: string | null;
  setSelectedDestination: (
    destination: string | null
  ) => void;
};

const RoutingContext =
  createContext<RoutingContextType | null>(null);

export function useRouting() {
  const context = useContext(RoutingContext);

  if (!context) {
    throw new Error(
      "useRouting harus digunakan di dalam AppShell"
    );
  }

  return context;
}

/* =========================================================
   APP SHELL
   ========================================================= */

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  /* TAMBAHAN */
  const [selectedDestination, setSelectedDestination] =
    useState<string | null>(null);

  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/";

  return (
    <>
      {isAuthPage ? (
        <>{children}</>
      ) : (
        <RoutingContext.Provider
          value={{
            selectedDestination,
            setSelectedDestination,
          }}
        >
          <>
            <div
              className={`fixed top-0 right-0 z-40 transition-all duration-300 ${
                isOpen ? "left-64" : "left-20"
              }`}
            >
              <Navbar />
            </div>

            <Sidebar
              isOpen={isOpen}
                setIsOpenAction={setIsOpen}
            />

            <main
              className={`min-h-screen transition-all duration-300 ${
                isOpen ? "ml-64" : "ml-20"
              }`}
            >
              {children}
            </main>
          </>
        </RoutingContext.Provider>
      )}

      <Toaster
        position="top-center"
        richColors
      />
    </>
  );
}