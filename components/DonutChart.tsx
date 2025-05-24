"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export function DonutChart({ percent }: { percent: number }) {
  const data = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [percent, 100 - percent],
        backgroundColor: ["#10B981", "#E5E7EB"],
        borderWidth: 0,
        cutout: "80%"
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          boxWidth: 10,
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="relative w-52 h-52">
      <Doughnut data={data} options={options}/>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold">{percent}%</span>
      </div>
    </div>
  );
}
