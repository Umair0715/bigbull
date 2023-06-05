import React, { useEffect, useRef, useState } from 'react'
import useClickOutside from '../../../Helpers/useClickOutside';
import { useSelector , useDispatch } from 'react-redux';
import { getPackageRequests } from '../../../redux/actions/packageRequestsActions'
import Loader from '../../../Components/global/Loader';
import ItemNotFound from '../../../Components/global/ItemNotFound';
import WithdrawRequestTable from '../../../Components/SidebarPages/Wallet/WithdrawRequestTable'
import PackageRequestTable from '../../../Components/SidebarPages/Wallet/PackageRequestTable';


const PackageRequests = () => {
    const dispatch = useDispatch();
    const viewRef = useRef(null)

    const { loading , requests , currentPage } = useSelector(state => state.packageRequest);

    useClickOutside(viewRef, () => setIsView(false));

    useEffect(() => {
        dispatch(getPackageRequests());
    }, [currentPage])

    return (
        <section className='p-10'>
            <header className='font-semibold text-xl '>
                Package Requests
            </header>
            {/* container */}

            <div className='flex flex-col mt-5 '>
                <div className='card'>
                    {/* header */}
                    <div className='overflow-auto '>
                        {
                            loading 
                            ? 
                                <Loader />
                            :
                            requests?.length > 0 
                            ? 
                                <PackageRequestTable />  
                            : 
                                <ItemNotFound />

                        }
                    </div>
                    
                </div>
            </div>
        </section>
    )
}

export default PackageRequests
