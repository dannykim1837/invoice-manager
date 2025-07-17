import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const InvoiceChart = ({ data }) => {
    const amountsPerMonth = Array(12).fill(0);

    if (data && data.length > 0) {
      data.forEach(inv => {
        const date = new Date(inv.due_date);
        const monthIdx = date.getMonth(); 
        amountsPerMonth[monthIdx] += Number(inv.amount);
      });
    }

    const chartData = {
        labels: MONTH_LABELS,
        datasets: [
            {
                label: 'Amount',
                data: amountsPerMonth,
                backgroundColor: 'rgba(100, 149, 237, 0.6)',
                borderColor: 'rgba(0, 0, 0, 0.3)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        maintainAspectRatio: false,
        height: 220,
        scales: {
            y: { beginAtZero: true, suggestedMax: 1000 }
        }
    };

    return (
        <div style={{ width: '100%', minHeight: 240, height: 240 }}>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};
export default InvoiceChart;
