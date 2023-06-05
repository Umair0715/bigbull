import React, { useState } from 'react'
import EarningStatSvg from '../../assets/svgs/EarningStatSvg'
import EarningSvg from '../../assets/svgs/EarningSvg'
import LineChart from './Chart/LineChart'
import { UserData } from './Chart/data'

const EarningStatistics = () => {
    const [data, setData] = useState({
        labels: UserData.map(data => data.year),
        datasets: [{
            label: "User Gained",
            data: UserData.map(data => data.userGain),
            backgroundColor: 'blue',         
        }]
    });

    return (
        <section className='px-10 pb-5'>
            <div className='shadow-xl rounded-2xl border my-8 bg-primary '>
                {/* header */}
                <div className='flex justify-between px-5 gradient-1  border rounded-t-2xl py-2'>
                    <p className='flex items-center gap-2 font-semibold'>
                        <EarningSvg />
                        <span>Earning statistics for business analytics</span>
                    </p>
                    <p className='flex items-center gap-2 font-semibold'>
                        <span>This Year Earning</span>
                        <EarningStatSvg />
                    </p>
                </div>
                {/* Statistics */}
                <div className='px-6 py-6'>
                    <div >
                        <span className='gradient-3 border px-24 py-1 rounded-lg text-white'>Earnings 0.05</span>
                    </div>
                    {/* chart */}
                    <div className='w-full bg-white  px-8 my-5 rounded-lg'>
                    <LineChart chartData={data} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EarningStatistics
