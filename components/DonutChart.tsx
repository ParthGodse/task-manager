"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import CountUp from "react-countup";
ChartJS.register(ArcElement, Tooltip, Legend);

export function DonutChart({ percent }: { percent: number }) {
  const data = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [percent, 100 - percent],
        backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || "#3b82f6",
          getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || "#e5e7eb",
        ],
        borderWidth: 0,
        cutout: "80%"
      },
    ],
  };
  const options = {
    layout:{
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          boxWidth: 10,
          font: { size: 12 },
          color: "rgb(var(--foreground))",
        },
      },
    },
  };

  return (
    <div className="relative w-54 h-60 text-foreground p-0">
      <Doughnut data={data} options={options}/>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* <span className="text-3xl font-bold text-primary">{percent}%</span> */}
        <CountUp
          end={percent}
          duration={1}
          suffix="%"
          className="text-3xl font-bold text-primary"
        />
      </div>
    </div>
  );
}
