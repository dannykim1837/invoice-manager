// src/components/ExpenseChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

// Register pie chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No expense data available.</p>;
    }

    // Group amounts by category
    const categoryTotals = {};
    data.forEach((item) => {
        const category = item.category || 'Uncategorized';
        categoryTotals[category] = (categoryTotals[category] || 0) + item.amount;
    });

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Total by Category',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: 'rgba(0, 0, 0, 0.2)',
                borderWidth: 1
            }
        ]
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Pie data={chartData} />
        </div>
    );
};

export default ExpenseChart;
