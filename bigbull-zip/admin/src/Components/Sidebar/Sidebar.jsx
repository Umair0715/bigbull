import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import DownArrow from '../../assets/svgs/DownArrow'
import HomeSvg from '../../assets/svgs/HomeSvg'
import UsersSvg from '../../assets/svgs/UsersSvg'
import SettingsSvg from '../../assets/svgs/SettingsSvg'
import WalletSvg from '../../assets/svgs/WalletSvg'
import HistorySvg from '../../assets/svgs/HistorySvg'
import ReportSvg from '../../assets/svgs/ReportSvg'
import PackagesSvg from '../../assets/svgs/PackagesSvg'
import { useGlobalContext } from '../../Context/context';
import useClickOutside from '../../Helpers/useClickOutside'


const Sidebar = () => {
    const sidebarRef = useRef(null);
    const [isSettingsList, setIsSettingsList] = useState(false)
    const [isWalletList, setIsWalletList] = useState(false)
    const [isHistoryList, setIsHistoryList] = useState(false)
    const { isSidebarOpen, setIsSidebarOpen } = useGlobalContext();
    const location = useLocation();

    const openSettingsList = () => {
        setIsSettingsList(!isSettingsList)
    }
    const openWalletList = () => {
        setIsWalletList(!isWalletList)
    }
    const openHistoryList = () => {
        setIsHistoryList(!isHistoryList)
    }

    useClickOutside(sidebarRef, () => setIsSidebarOpen(false))


    const isActive = (path, home) => {
        if (home) return location.pathname === '/';
        return location.pathname.split('/').includes(path)
    }

    return (
        <aside
            ref={sidebarRef}
            className={`h-screen w-72 overflow-y-auto py-2 border-r shadow-xl bg-primary
                    md:relative absolute  md:translate-x-0 z-20 transition-all
                    ${!isSidebarOpen && '-translate-x-full '}`}>
            {/* logo */}
            <div className='flex justify-center'>
                <img src='/images/logo.svg' alt="" />
            </div>
            {/* Sidebar Pages container */}
            <div className='py-7'>
                <ul className='flex flex-col gap-5 text-base font-medium whitespace-nowrap'>
                    {/* Dashboard */}
                    <Link to='/' className={`${isActive('/', 'home') ? 'active' : ''} `}>
                        <li >
                            <p className='px-5 flex items-center gap-5'>
                                <HomeSvg />
                                <span> Dashboard</span>
                            </p>
                        </li>
                    </Link>
                    {/* All Users */}
                    <Link to='/users' className={`${isActive('users') ? 'active' : ''} `}>
                        <li >
                            <p className='px-5 flex items-center gap-5'>
                                <UsersSvg />
                                <span>All Users</span>
                            </p>
                        </li>
                    </Link>
                    <Link to='/promoted-users' className={`${isActive('promoted-users') ? 'active' : ''} `}>
                        <li >
                            <p className='px-5 flex items-center gap-5'>
                                <UsersSvg />
                                <span>Promoted Users</span>
                            </p>
                        </li>
                    </Link>
                    {/* Packages */}
                    <Link to='/packages' className={`${isActive('packages') ? 'active' : ''} `}>
                        <li >
                            <p className='px-5 flex items-center gap-5'>
                                <PackagesSvg />
                                <span>Packages</span>
                            </p>
                        </li>
                    </Link>
                    {/* Special Packages */}
                    <Link to='/special-packages' className={`w-fit ${isActive('special-packages') ? 'active' : ''} `}>
                        <li >
                            <p className='px-5 flex items-center gap-5'>
                                <PackagesSvg />
                                <span>Special Packages</span>
                            </p>
                        </li>
                    </Link>

                    {/* Ranks */}
                    <Link to='/ranks' className={`${isActive('ranks') ? 'active' : ''}`}>
                        <li className='px-5 flex items-center'>
                            <p className='flex items-center justify-between gap-5'>
                                <ReportSvg />
                                <span>Ranks</span>
                            </p>
                        </li>
                    </Link>

                    <Link to='/achieved-ranks' className={`${isActive('achieved-ranks') ? 'active' : ''}`}>
                        <li className='px-5 flex items-center'>
                            <p className='flex items-center justify-between gap-5'>
                                <ReportSvg />
                                <span>Achieved Ranks</span>
                            </p>
                        </li>
                    </Link>
                    {/* Settings */}

                    <li onClick={openSettingsList} className={`${isActive('settings') ? 'parent-active' : ''}  px-5 flex items-center justify-between cursor-pointer`}>
                        <p className=' flex items-center justify-between gap-5'>
                            <SettingsSvg />
                            <span> Settings</span>
                        </p>
                        <DownArrow />
                    </li>

                    {/* settings list */}
                    {
                        isSettingsList &&
                        <ul className='text-xs list-disc pl-14 whitespace-nowrap
                        flex flex-col gap-2 '>
                            <Link to='settings/website-setup' className={`${isActive('website-setup') ? 'sub-active' : ''} `} >
                                <li >Website Setup</li>
                            </Link>
                            <Link to='settings/company-profiles' className={`${isActive('company-profiles') ? 'sub-active' : ''} `}>
                                <li >Company All Profiles </li>
                            </Link>
                        </ul>
                    }
                    {/* Wallet */}

                    <li onClick={openWalletList} className={`${isActive('wallet') ? 'parent-active' : ''}     px-5 flex items-center justify-between cursor-pointer `}>
                        <p className='flex justify-between items-center gap-5'>
                            <WalletSvg />
                            <span>Wallet</span>
                        </p>
                        <DownArrow />
                    </li>

                    {/* Wallet list */}
                    {
                        isWalletList &&
                        <ul className='text-xs list-disc pl-14 whitespace-nowrap
                        flex flex-col gap-2'>
                            <Link to='wallet/withdraw-requests' className={`${isActive('withdraw-requests') ? 'sub-active' : ''} `}>
                                <li >Withdraw Requests</li>
                            </Link>
                            <Link to='wallet/deposit-requests' className={`${isActive('deposit-requests') ? 'sub-active' : ''} `}>
                                <li >Deposit Requests  </li>
                            </Link>
                            <Link to='wallet/cash-wallet' className={`${isActive('cash-wallet') ? 'sub-active' : ''} `}>
                                <li >Cash Wallet </li>
                            </Link>
                            <Link to='wallet/roi' className={`${isActive('roi') ? 'sub-active' : ''} `}>
                                <li >ROI </li>
                            </Link>
                            <Link to='wallet/team-bonus' className={`${isActive('team-bonus') ? 'sub-active' : ''} `}>
                                <li >Team Bonus</li>
                            </Link>
                            <Link to='wallet/bull-track-bonus' className={`${isActive('bull-track-bonus') ? 'sub-active' : ''} `}>
                                <li >Bull Track Bonus</li>
                            </Link>
                            <Link to='wallet/transfer-amount' className={`${isActive('transfer-amount') ? 'sub-active' : ''} `}>
                                <li>Transfer Amount</li>
                            </Link>
                            <Link to='wallet/package-requests' className={`${isActive('package-requests') ? 'sub-active' : ''} `}>
                                <li>Package Requests</li>
                            </Link>
                        </ul>
                    }

                    <Link to='/kycs' className={`${isActive('reports') ? 'active' : ''}`}>
                        <li className='px-5 flex items-center'>
                            <p className='flex items-center justify-between gap-5'>
                                <ReportSvg />
                                <span>Kyc</span>
                            </p>
                        </li>
                    </Link>

                    {/* History */}
                    <li onClick={openHistoryList} className={`${isActive('history') ? 'parent-active' : ''} px-5 flex items-center justify-between w-full cursor-pointer`}>
                        <p className='flex items-center justify-between gap-5'>
                            <HistorySvg />
                            <span>History</span>
                        </p>
                        <DownArrow />
                    </li>

                    {/* History list */}
                    {
                        isHistoryList &&
                        <ul className='text-xs list-disc pl-14 whitespace-nowrap
                        flex flex-col gap-2 '>
                            <Link to='history/transfer-history' className={`${isActive('transfer-history') ? 'sub-active' : ''} `}>
                                <li >Transfer History</li>
                            </Link>
                        </ul>
                    }
                    {/* Reports */}
                    <Link to='/reports' className={`${isActive('reports') ? 'active' : ''}`}>
                        <li className='px-5 flex items-center'>
                            <p className='flex items-center justify-between gap-5'>
                                <ReportSvg />
                                <span>Reports</span>
                            </p>
                        </li>
                    </Link>
                </ul>

            </div>
        </aside>
    )
}

export default Sidebar
