import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressBar from './ProgressBar';
import { useEffect, useRef, useState } from 'react';

let percentageDisplay = 60

const BullTrackPeriod = () => {
    const [timerDays, setTimerDays] = useState('00')
    const [timerHours, setTimerHours] = useState('00')
    const [timerMinutes, setTimerMinutes] = useState('00')
    const [timerSeconds, setTimerSeconds] = useState('00')

    let interval = useRef(null)

    const startTimer = () => {
        const countdownDate = new Date(2023, 3, 15 + 10, 0, 0, 0).getTime()

        interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = countdownDate - now
            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            let values = [days, hours, minutes, seconds];
            values = values.map(value => value < 10? `0${value}` : value)

            if (distance < 0) {
                clearInterval(interval.current)
            } else {
                setTimerDays(values[0])
                setTimerHours(values[1])
                setTimerMinutes(values[2])
                setTimerSeconds(values[3])
            }
        }, 1000)
    }
    useEffect(() => {
        startTimer()
        return () => clearInterval(interval.current)
    }, [])

    return (
        <>
            <section className='p-10'>
                <div className="bg-black rounded-lg py-4 px-8 mb-4 mt-4  w-full">
                    <div className="flex justify-between sm:flex-row items-center  flex-wrap gap-8  w-full">
                        <div className="flex-1">

                            <h2 className="text-white text-2xl font-medium py-2">Bull Track Period</h2>
                            <h6 className="text-white py-1">{timerDays} Days, {timerHours} Hours and {timerMinutes} minutes Remaining as a new User 4/5</h6>
                            <ProgressBar completed={percentageDisplay} />
                        </div>
                        <div className="flex sm:flex-row flex-col gap-4">
                            <div className="w-[100px] h-[100px]">
                                <CircularProgressbarWithChildren value={percentageDisplay} styles={buildStyles({
                                    rotation: 1,
                                    textSize: '16px',
                                    pathTransitionDuration: 0.5,
                                    pathColor: '#A30000',
                                    textColor: '#f88',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}>
                                    <div style={{ fontSize: 16, marginTop: -5, color: "white" }}>
                                        <strong>{timerDays} Days</strong>
                                    </div>
                                    <div style={{ fontSize: 12, marginTop: 0, color: "white" }}>
                                        {timerHours}:{timerMinutes}:{timerSeconds}
                                    </div>
                                </CircularProgressbarWithChildren>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BullTrackPeriod;
