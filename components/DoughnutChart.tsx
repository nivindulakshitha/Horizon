"use client"

import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Doughnut} from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({accounts}: {accounts: Account[]}) => {

    const data = {
        datasets: [
            {
                label: 'Banks',
                data: [1250, 2500, 5000],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }
        ],
        labels: ["Bank 1", "Bank 2", "Bank 3"]
    }

    return <Doughnut data={data}/>
}

export default DoughnutChart;