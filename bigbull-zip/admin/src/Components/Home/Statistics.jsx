import React from 'react'
import StatisticsSvg from '../../assets/svgs/StatisticsSvg'

const Statistics = () => {
    return (
        <section className='px-10 pt-10 pb-5'>
            <header className='font-semibold text-2xl '>
                Dashboard
            </header>
            <div className='shadow-xl rounded-2xl border mt-8'>
                {/* header */}
                <div className='flex justify-between px-5 gradient-1 border rounded-t-2xl py-2'>
                    <p className='flex items-center gap-2 font-semibold'>
                        <StatisticsSvg />
                        <span>Dashboard</span>
                    </p>
                    <select className='px-2 py-1 rounded-lg text-black outline-none border-2 focus:border-primary'>
                        <option value="">All Over Statistics</option>
                        <option value=""> Statistics</option>
                        <option value=""> Statistics</option>
                        <option value=""> Statistics</option>
                    </select>
                </div>
                {/* Statistics */}
                <div className='px-6 py-6 '>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                        {/* single card */}
                        <div className='bg-[#2F2F39] py-14 rounded-2xl'>  </div>
                        <div className='bg-[#2F2F39] py-14 rounded-2xl'>  </div>
                        <div className='bg-[#2F2F39] py-14 rounded-2xl'>  </div>
                        <div className='bg-[#2F2F39] py-14 rounded-2xl'>  </div>
                    </div>
                    <div className='bg-[#2F2F39] mt-6 py-14 rounded-2xl'>  </div>
                </div>
            </div>
        </section>
    )
}

export default Statistics
