"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa";
import { CiGrid41 } from "react-icons/ci";
import { MdQueue } from "react-icons/md";
import { FaFileMedicalAlt } from "react-icons/fa";
import { FaUserClock } from "react-icons/fa";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const navItems = [
  { 
    href: "/beranda", 
    label: "ICU-Q Dashboard", 
    icon: <CiGrid41 size={20} /> 
  },

  { 
    href: "/tambahpasien", 
    label: "Patient Registration", 
    icon: <MdQueue size={18} /> 
  },

  { 
    href: "/antrean", 
    label: "ICU Queue", 
    icon: <FaUserClock size={20} /> 
  },
  { 
    href: "/riwayat", 
    label: "Patient History", 
    icon: <FaFileMedicalAlt size={20} /> 
  },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
    className={`fixed top-0 left-0 h-screen bg-white text-blue-700 transition-all duration-300 z-50 flex flex-col shadow-2xl ${
    isOpen ? "w-64" : "w-20"
  }`}
>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4">
  {isOpen ? (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Image
          src="/icuq.png"
          alt="ICU-Q logo"
          width={34}
          height={34}
          className="h-8 w-8 scale-125 object-contain"
          priority
        />
      </div>

      <div>
        <h1 className="text-lg font-bold text-blue-900">
          ICU-Q
        </h1>
        <p className="text-[10px] text-gray-600">
          ICU Queue Intelligence
        </p>
      </div>
    </div>
  ) : (
    <div />
  )}

  <button
    onClick={() => setIsOpen(!isOpen)}
    className="p-2 rounded-lg hover:bg-blue-100 transition text-blue-700"
    title="Toggle sidebar"
  >
    <FaBars size={16} />
  </button>
</div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
  isActive
    ? "bg-blue-100 text-blue-700 shadow-md scale-105 border-r-4 border-blue-600"
    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
}`}
                title={!isOpen ? item.label : undefined}
              >
                <span className="shrink-0 text-blue-600">
  {item.icon}
</span>
                <span
                  className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="px-4 py-3">
            <p className="text-xs text-slate-400">ICU-Q v1.0 Prototype</p>
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
