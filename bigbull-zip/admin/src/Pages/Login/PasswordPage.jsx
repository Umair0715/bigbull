import React, { useEffect } from 'react'
import Password from '../../Components/Login/Password'

const PasswordPage = ({setIsLoginPage}) => {
    useEffect(()=> {
        setIsLoginPage(true)

        return () =>  setIsLoginPage(false)
    }, [])

    return (
        <Password />
    )
}

export default PasswordPage
