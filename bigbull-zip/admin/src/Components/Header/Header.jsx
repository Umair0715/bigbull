import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Hamburger from '../../assets/svgs/Hamburger'
import UserSvg from '../../assets/svgs/UserSvg'
import { useGlobalContext } from '../../Context/context'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/actions/authActions'

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { openSidebar } = useGlobalContext();
    
    const logoutHandler = () => {
        dispatch(logout(navigate));
    }

    return (
        <header className='border-b-2 flex justify-between pr-14 pl-6 py-4 gradient-1 w-full md:relative fixed'>
            <div onClick={openSidebar} className='md:invisible cursor-pointer'>
                <Hamburger />
            </div>
            <div>
                <button 
                className="gradient-3 border text-white px-8 py-2 rounded-lg"
                onClick={logoutHandler}
                >
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Header
