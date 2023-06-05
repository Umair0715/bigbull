import React, { useEffect } from 'react'
import Email from '../../Components/Login/Email'

const EmailPage = ({setIsLoginPage}) => {
    useEffect(()=> {
        setIsLoginPage(true)

        return () =>  setIsLoginPage(false)
    }, [])

    return (
        <Email />
    )
}

export default EmailPage
