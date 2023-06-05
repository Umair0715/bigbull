import React, { useEffect, useRef, useState } from 'react'
import useClickOutside from '../../../Helpers/useClickOutside';
import { useSelector , useDispatch } from 'react-redux';
import { getWithdrawRequests } from '../../../redux/actions/withdrawActions'
import Loader from '../../../Components/global/Loader';
import ItemNotFound from '../../../Components/global/ItemNotFound';
import WithdrawRequestTable from '../../../Components/SidebarPages/Wallet/WithdrawRequestTable'


const WithdrawRequestsPage = () => {
    const dispatch = useDispatch();
    const viewRef = useRef(null)

    const { loading , requests , currentPage } = useSelector(state => state.withdraw);

    useClickOutside(viewRef, () => setIsView(false));

    useEffect(() => {
        dispatch(getWithdrawRequests());
    }, [currentPage])

    return (
        <section className='p-10'>
            <header className='font-semibold text-xl '>
                Withdraw Requests
            </header>
            {/* container */}

            <div className='flex flex-col mt-5 '>
                <div className='card'>
                    {/* header */}
                    <div className=' p-5 py-6 flex items-center justify-end w-full '>
                        <div className='border rounded-xl '>
                            <input className='px-3 rounded-l-xl outline-none py-2 text-black' type="text" placeholder='Search' />
                            <span className='border-l p-2 px-4 cursor-pointer'><i className="uil uil-search"></i></span>
                        </div>
                    </div>
                    <div className='overflow-auto '>
                        {
                            loading 
                            ? 
                                <Loader />
                            :
                            requests?.length > 0 
                            ? 
                                <WithdrawRequestTable />  
                            : 
                                <ItemNotFound />

                        }
                    </div>
                    
                </div>
            </div>
        </section>
    )
}

export default WithdrawRequestsPage
