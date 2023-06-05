import React from 'react'
import EarningStatistics from './EarningStatistics'
import Statistics from './Statistics'
import BullTrackPeriod from './Timer/BullTrackPeriod'

const Dashboard = () => {
    return (
        <>
            <Statistics />
            <EarningStatistics />
            {/* <BullTrackPeriod/> */}
        </>
    )
}

export default Dashboard
