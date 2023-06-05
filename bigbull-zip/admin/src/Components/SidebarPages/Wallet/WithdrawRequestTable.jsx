import React, { useEffect, useRef, useState } from 'react'
import SettingsSvg from '../../../assets/svgs/SettingsSvg'
import DownArrow from '../../../assets/svgs/DownArrow'
import View from '../../../assets/svgs/View'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../../../Context/context'
import useClickOutside from '../../../Helpers/useClickOutside';
import { useSelector , useDispatch } from 'react-redux';
import { getWithdrawRequests } from '../../../redux/actions/withdrawActions'
import { setCurrentPage } from '../../../redux/reducers/withdrawReducer';
import Pagination from '../../global/pagination';
import moment from 'moment'
import PaymentStatus from '../../global/PaymentStatus'
import Cookies from 'js-cookie';

const WithdrawRequestTable = () => {
    const dispatch = useDispatch();
    const { openModal } = useGlobalContext()
    const [isView, setIsView] = useState(false)
    const [isIndex, setIsIndex] = useState(null)
    const viewRef = useRef(null)

    const { requests , pages  , currentPage } = useSelector(state => state.withdraw);

    const viewIndex = (index) => {
        setIsIndex(index)
        setIsView(true)
    }

    useClickOutside(viewRef, () => setIsView(false));

    const handleViewClick = (e , item) => {
        e.stopPropagation();
        setIsView(false)
        localStorage.setItem('selectedRequest' , JSON.stringify(item));
        openModal();
        
    }

    return (
        <table className='w-full '>
            <thead >
                <tr className='bg-black '>
                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                        #
                    </th>
                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                        NAME/DATE
                    </th>
                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                        ID
                    </th>
                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                        AMOUNT
                    </th>
                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                        STATUS
                    </th>
                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                        ACTIONS
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    requests?.map((item, index) => {
                        return (
                            <tr key={index} className='border-b'>
                                <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>{index+1}</td>
                                <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-2 '>
                                    <p className='flex flex-col'>
                                        <span>{item?.user?.username}</span>
                                        <small>
                                            {moment(item?.createdAt).format('DD/MM/YYYY')}
                                        </small>
                                    </p>
                                </td>
                                <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>
                                    {item?._id}
                                </td>
                                <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>
                                    ${item?.amount}
                                </td>

                                <td className='text-center px-5 whitespace-nowrap py-4 text-sm font-medium '>
                                    <div className='flex items-center justify-center'>
                                    <PaymentStatus status={item?.status} />
                                    </div>
                                </td>
                                <td className='text-center py-4 flex justify-center px-5 whitespace-nowrap'>
                                    <div onClick={() => viewIndex(index)} className='h-full  flex items-center justify-center gap-3 rounded-lg py-1 px-2 border gradient-3 cursor-pointer relative'>
                                        <SettingsSvg />
                                        <DownArrow />
                                        {
                                            isView && isIndex === index &&
                                            <div ref={viewRef} onClick={(e) => handleViewClick(e , item)} className='absolute left-1/2 -translate-x-[50%] top-full rounded-xl text-sm font-medium bg-white text-black px-4 py-4 z-30 flex items-center gap-1 '
                                            >
                                                <View />
                                                <span>View</span>
                                            </div>
                                        }
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
            <Pagination 
            currentPage={currentPage}
            setPage={setCurrentPage}
            pageCount={pages}
            />
        </table>
    )
}

export default WithdrawRequestTable
