import React, { useEffect } from 'react'
import Login from '../../Components/Login/Login'

const LoginPage = ({setIsLoginPage}) => {
    useEffect(()=> {
        setIsLoginPage(true)
        return () =>  setIsLoginPage(false)
    }, [])

    return (
        <Login />
    )
}

export default LoginPage
