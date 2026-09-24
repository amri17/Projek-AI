"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }: { data: { name: string; value: number }[] }) {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: "Distribusi",
        data: data.map(item => item.value),
        backgroundColor: ["#3b82f6", "#ec4899", "#22c55e"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  return (
    <div className="w-full flex justify-center py-4">
      <div className="w-80 h-80">
        <Pie data={chartData} />
      </div>
    </div>
  );
}
