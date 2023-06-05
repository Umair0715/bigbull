import React, { useEffect } from 'react'
import Otp from '../../Components/Login/Otp'

const OtpPage = ({setIsLoginPage}) => {
    useEffect(()=> {
        setIsLoginPage(true)

        return () =>  setIsLoginPage(false)
    }, [])

    return (
        <div>
            <Otp />
        </div>
    )
}

export default OtpPage
