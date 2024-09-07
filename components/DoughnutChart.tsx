"use client"

import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Doughnut} from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }: { accounts: Account[] }) => {
    
    const accountsName = accounts.map(account => account.name);
    const accountsBalance = accounts.map(account => account.currentBalance);

    const data = {
        datasets: [
            {
                label: 'Banks',
                data: accountsBalance,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }
        ],
        labels: accountsName
    }

    return <Doughnut 
        data={data}
        options={{
            cutout: '60%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }}
    />
}

export default DoughnutChart;