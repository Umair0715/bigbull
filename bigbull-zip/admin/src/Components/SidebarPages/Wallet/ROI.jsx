import React, { useEffect } from 'react'
import { useDispatch , useSelector } from 'react-redux';
import { getRoiWalletHistory } from '../../../redux/actions/roiWalletHistoryActions';
import { setCurrentPage } from '../../../redux/reducers/roiWalletHistoryReducer';
import Loader from '../../global/Loader';
import ItemNotFound from '../../global/ItemNotFound';
import moment from 'moment';
import Pagination from '../../global/pagination';

const ROI = () => {
    const dispatch = useDispatch();
    const { histories , loading , currentPage , pages } = useSelector(state => state.roiWalletHistory);

    useEffect(() => {
        dispatch(getRoiWalletHistory())
    }, [currentPage]);


    return (
        <section className='p-10'>
            <header className='font-semibold text-xl '>
                ROI History
            </header>
        <div className='card mt-10'>
            {/* header */}
            <div className=' p-5 py-6 flex items-center justify-end w-full '>
            </div>
            <div className='overflow-auto '>
                {   
                    loading
                    ?
                        <Loader />
                    :
                    histories?.length > 0 
                    ? 
                        <table className='w-full '>
                            <thead >
                            <tr className='bg-black '>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>#</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>NAME/DATE</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>ROI</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>DEPOSIT AMOUNT </th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>WALLET ID</th>
                                
                            </tr>
                            </thead>
                            <tbody>
                            {
                                histories?.map((item, index) => {
                                return (
                                    <tr key={index} className='border-b'>
                                    <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>{index+1}</td>
                                    <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-2 '>
                                        <p className='flex flex-col'>
                                        <span>{item?.user?.username}</span>
                                        <small>{moment(item?.createdAt).format('DD MMM YYYY')}</small>
                                        </p>
                                    </td>
                                    <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>
                                        {item?.ROI.toFixed(2)}
                                    </td>
                                    <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>
                                        {item?.activeDeposit}
                                    </td>
                                    <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>{item?.wallet?._id}</td>
                                    
                                    </tr>
                                )
                                })
                            }
                            </tbody>
                        </table>
                    :
                        <ItemNotFound />
                }
            </div>
            {/* Pagination */}
            <Pagination
            currentPage={currentPage}
            pageCount={pages}
            setPage={setCurrentPage}
            />
        </div>
        </section>
    )
}

export default ROI
