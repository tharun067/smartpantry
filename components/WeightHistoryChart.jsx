"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

function WeightHistoryChart({ history, unit }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !history?.length) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const ctx = chartRef.current.getContext("2d");

    const labels = history.map((item) =>
      new Date(item.timestamp).toLocaleDateString()
    );
    const data = history.map((item) => item.weight);

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `Weight (${unit})`,
            data,
            borderColor: "rgb(79, 70, 229)",
            backgroundColor: "rgba(79, 70, 229, 0.1)",
            tension: 0.1,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw} ${unit}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: `Weight (${unit})`,
            },
          },
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [history, unit]);

  return (
    <div className="w-full h-64">
      <canvas ref={chartRef} />
    </div>
  );
}

export default WeightHistoryChart;
