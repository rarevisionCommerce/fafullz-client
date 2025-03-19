import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const SalesChart = ({ data }) => {
  const chartRef = useRef();
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const chartCanvas = chartRef.current;
    const chartContext = chartCanvas.getContext("2d");

    // Destroy existing chart instance, if any
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart instance
    chartInstanceRef.current = new Chart(chartContext, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: data.title,
            data: data.values,
            backgroundColor: data.backgroundColor,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    // Return cleanup function to destroy chart instance on unmount
    return () => {
      chartInstanceRef.current.destroy();
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default SalesChart;
