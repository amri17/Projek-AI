import React from "react";

interface Props {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

export default function StatCard({
  icon,
  value,
  label,
  color,
}: Props) {
  return (
    <div className="bg-white rounded-2xl p-5">

      <div className={`${color} mb-3`}>
        {icon}
      </div>

      <h2 className={`text-4xl font-semibold ${color}`}>
        {value}
      </h2>

      <p className="text-gray-500 mt-2">
        {label}
      </p>

    </div>
  );
}