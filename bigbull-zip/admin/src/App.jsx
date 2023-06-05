import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './Components/Header/Header'
import Sidebar from './Components/Sidebar/Sidebar'
import ErrorPage from './Pages/Error/ErrorPage'
import HomePage from './Pages/Home/HomePage'
import AllUsersPage from './Pages/SidebarPages/AllUsers/AllUsersPage'
import CompanyAllProfilesPage from './Pages/SidebarPages/Settings/CompanyAllProfilesPage'
import WebsiteSetupPage from './Pages/SidebarPages/Settings/WebsiteSetupPage'
import WithdrawRequestsPage from './Pages/SidebarPages/Wallet/WithdrawRequestsPage'
import DepositRequestsPage from './Pages/SidebarPages/Wallet/DepositRequestsPage'
import TransferHistoryPage from './Pages/SidebarPages/History/TransferHistoryPage'
import TransactionHistoryPage from './Pages/SidebarPages/History/TransactionHistoryPage'
import SponsorHistoryPage from './Pages/SidebarPages/History/SponsorHistoryPage'
import LoginPage from './Pages/Login/LoginPage'
import EmailPage from './Pages/Login/EmailPage'
import OtpPage from './Pages/Login/OtpPage'
import PasswordPage from './Pages/Login/PasswordPage'
import UserDetailsPage from './Pages/SidebarPages/AllUsers/UserDetailsPage'
import WithdrawRequestModal from './Components/SidebarPages/Wallet/WithdrawRequestModal'
import PackagesPage from './Pages/SidebarPages/Packages/PackagesPage'
import SpecialPackagesPage from './Pages/SidebarPages/SpecialPackages/SpecialPackagesPage'
import CashWalletPage from './Pages/SidebarPages/Wallet/CashWalletPage'
import ROIPage from './Pages/SidebarPages/Wallet/ROIPage'
import TeamBonusPage from './Pages/SidebarPages/Wallet/TeamBonusPage'
import BullTrackBonusPage from './Pages/SidebarPages/Wallet/BullTrackBonusPage';
import { ToastContainer } from 'react-toastify';
import EditPackage from './Pages/SidebarPages/Packages/EditPackage'
import TransferAmount from './Pages/SidebarPages/Wallet/TransferAmount'
import EditUser from './Pages/SidebarPages/AllUsers/EditUser'
import EditSpecialPackage from './Pages/SidebarPages/SpecialPackages/EditSpecialPackage'
import AssignSpecialPackage from './Pages/SidebarPages/SpecialPackages/AssignSpecialPackage'
import Ranks from './Pages/SidebarPages/ranks'
import AddNewRank from './Pages/SidebarPages/ranks/AddNewRank'
import EditRank from './Pages/SidebarPages/ranks/EditRank'
import Kycs from './Pages/SidebarPages/kyc'
import KycDetails from './Pages/SidebarPages/kyc/KycDetails'
import PromotedUsers from './Pages/SidebarPages/AllUsers/PromotedUsers'
import AchievedRanks from './Pages/SidebarPages/achievedRanks'
import PackageRequests from './Pages/SidebarPages/Wallet/PackageRequests'

const App = () => {
    const [ isLoginPage, setIsLoginPage ] = useState(false)

    return (
        <>

            <div className='relative'>
                <WithdrawRequestModal />
            </div>

            <main className='md:flex relative'>
                {!isLoginPage && <Sidebar />}
                <div className=' w-full flex flex-col h-screen overflow-y-auto relative z-10 gradient-2'>
                    {!isLoginPage && <Header />}
                    <ToastContainer 
                    position='top-center'
                    autoClose={4000}
                    
                    />
                    <Routes>
                        {/* Login */}
                        <Route 
                        path='/login' 
                        element={<LoginPage setIsLoginPage={setIsLoginPage} />} 
                        />
                        <Route 
                        path='/email' 
                        element={<EmailPage setIsLoginPage={setIsLoginPage} />}
                        />
                        <Route 
                        path='/otp' 
                        element={<OtpPage setIsLoginPage={setIsLoginPage} />} 
                        />
                        <Route 
                        path='/password' 
                        element={<PasswordPage setIsLoginPage={setIsLoginPage} 
                        />} />
                        {/* Home */}
                        <Route 
                        path='/' 
                        element={<HomePage />} 
                        />
                        {/* All Users */}
                        <Route 
                        path='/users' 
                        element={<AllUsersPage />} 
                        />
                        <Route 
                        path='/promoted-users' 
                        element={<PromotedUsers />} 
                        />
                        <Route 
                        path='/users/user-details/:id' 
                        element={<UserDetailsPage />} 
                        />
                        {/* Packages */}
                        <Route 
                        path='/packages' 
                        element={<PackagesPage />} 
                        />
                        <Route 
                        path='/packages/edit/:packageId' 
                        element={<EditPackage />} 
                        />
                        
                        {/* Special Packages */}
                        <Route 
                        path='/special-packages' 
                        element={<SpecialPackagesPage />} 
                        />
                        <Route 
                        path='/special-packages/edit/:packageId' 
                        element={<EditSpecialPackage />} 
                        />
                        <Route 
                        path='/special-packages/assign/:packageId' 
                        element={<AssignSpecialPackage />} 
                        />
                        {/* Settings */}
                        <Route 
                        path='settings/website-setup' 
                        element={<WebsiteSetupPage />} 
                        />
                        <Route 
                        path='settings/company-profiles' 
                        element={<CompanyAllProfilesPage />}
                        />
                        {/* Wallet */}
                        <Route 
                        path='wallet/withdraw-requests' 
                        element={<WithdrawRequestsPage />} 
                        />
                        <Route 
                        path='wallet/deposit-requests' 
                        element={<DepositRequestsPage />} 
                        />
                        <Route 
                        path='wallet/cash-wallet' 
                        element={<CashWalletPage />} 
                        />
                        <Route 
                        path='wallet/roi' 
                        element={<ROIPage />}
                        />
                        <Route 
                        path='wallet/team-bonus' 
                        element={<TeamBonusPage />} 
                        />
                        <Route 
                        path='wallet/bull-track-bonus' 
                        element={<BullTrackBonusPage />} 
                        />
                        {/* History */}
                        <Route 
                        path='history/transfer-history' 
                        element={<TransferHistoryPage />} 
                        />
                        <Route 
                        path='history/transaction-history' 
                        element={<TransactionHistoryPage />} 
                        />
                        <Route 
                        path='history/sponsor-history' 
                        element={<SponsorHistoryPage />} 
                        />
                        <Route 
                        path='/wallet/transfer-amount'
                        element={<TransferAmount />}
                        />
                        <Route 
                        path='/users/edit-user/:id'
                        element={<EditUser /> }
                        />
                        {/* Ranks */}
                        <Route 
                        path='/ranks'
                        element={<Ranks /> }
                        />
                        <Route 
                        path='/achieved-ranks'
                        element={<AchievedRanks /> }
                        />
                        <Route 
                        path='/ranks/add-new'
                        element={<AddNewRank /> }
                        />
                        <Route 
                        path='/ranks/edit/:id'
                        element={<EditRank /> }
                        />
                        <Route 
                        path='/kycs'
                        element={<Kycs /> }
                        />
                        <Route 
                        path='/kycs/details/:id'
                        element={<KycDetails /> }
                        />
                        <Route 
                        path='/wallet/package-requests'
                        element={<PackageRequests /> }
                        />
                        {/* Error */}
                        <Route path='*' element={<ErrorPage />} />
                    </Routes>
                </div>
            </main>
        </>

    )
}

export default App

