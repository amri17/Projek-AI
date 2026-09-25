"use client";

import { FiBell, FiSettings } from "react-icons/fi";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  /**
   * Session dihitung langsung saat render.
   * Tidak perlu useEffect + useState karena
   * tidak ada data eksternal yang perlu disinkronkan.
   */
  const sessionText = getCurrentSession();

  const pageInfo: Record<
    string,
    {
      title: string;
      subtitle: string;
    }
  > = {
    "/beranda": {
      title: "MyToyagama",
      subtitle: sessionText,
    },

    "/monitoring": {
      title: "ICU Monitoring",
      subtitle: sessionText,
    },

    "/pasien": {
      title: "ICU Patient List",
      subtitle: sessionText,
    },

    "/tambahpasien": {
      title: "ICU Patient Registration",
      subtitle: sessionText,
    },

    "/antrean": {
      title: "ICU Queue",
      subtitle: sessionText,
    },

    "/riwayat": {
      title: "Patient History",
      subtitle: sessionText,
    },
  };

  const current =
    pageInfo[pathname] ?? {
      title: "ICU-Q",
      subtitle: sessionText,
    };

  return (
    <nav
      className="
        flex
        h-20
        w-full
        min-w-0
        items-center
        justify-between
        overflow-hidden
        border-b
        border-gray-200
        bg-white
        px-6
      "
    >
      {/* =====================================================
          KIRI
          ===================================================== */}

      <div className="min-w-0">
        <h1
          className="
            truncate
            text-2xl
            font-bold
            text-gray-800
          "
        >
          {current.title}
        </h1>

        <p
          className="
            truncate
            text-sm
            text-gray-500
          "
        >
          {current.subtitle}
        </p>
      </div>

      {/* =====================================================
          KANAN
          ===================================================== */}

      <div
        className="
          ml-6
          flex
          shrink-0
          items-center
          gap-6
        "
      >
        {/* SYSTEM STATUS */}

        <div
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-green-100
            px-4
            py-2
            text-green-700
          "
        >
          <FiSettings />

          <span className="font-medium">
            System Active
          </span>
        </div>

        {/* NOTIFICATION */}

        <div
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-gray-100
            px-4
            py-2
          "
        >
          <FiBell
            className="
              text-lg
              text-orange-500
            "
          />

          <span className="font-semibold">
            3
          </span>
        </div>
      </div>
    </nav>
  );
}

/* =========================================================
   SESSION
   ========================================================= */

function getCurrentSession() {
  const now = new Date();

  const date = now.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const hour = now.getHours();

  let session = "Morning Shift";

  if (hour >= 12 && hour < 17) {
    session = "Afternoon Shift";
  } else if (hour >= 17) {
    session = "Night Shift";
  }

  return `${date} • ${session}`;
}