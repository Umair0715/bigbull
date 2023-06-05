import React, { useEffect } from 'react'
import { useDispatch , useSelector } from 'react-redux';
import { getAllTransactionsHistory } from '../../../redux/actions/transactionsHistoryActions';
import { setCurrentPage } from '../../../redux/reducers/transactionsHistoryReducer';
import Loader from '../../global/Loader';
import ItemNotFound from '../../global/ItemNotFound';
import moment from 'moment';
import Pagination from '../../global/pagination';

const CashWallet = () => {
    const dispatch = useDispatch();
    const { histories , loading , currentPage , pages } = useSelector(state => state.transactionsHistory);

    useEffect(() => {
        dispatch(getAllTransactionsHistory())
    }, [currentPage]);

    return (
        <section className='p-10 '>
            <header className='font-semibold text-xl '>
                Cash Wallets History
            </header>
        <div className='card mt-10'>
            {/* header */}
            <div className=' p-5 py-6 flex items-center justify-end w-full '>
            <div className='border rounded-xl '></div>
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
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>FROM</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>TO</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>DATE</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>AMOUNT</th>
                                
                            </tr>
                            </thead>
                            <tbody>
                            {
                                histories?.map((item, index) => {
                                return (
                                    <tr key={index} className='border-b'>
                                    <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>{index+1}</td>
                                    <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>
                                        {item?.from?.username || '//'}
                                    </td>
                                    <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-2 '>
                                        {item?.to?.username || '//'}
                                    </td>
                                    <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>
                                        {moment(item?.createdAt).format("DD MMM YYYY")}
                                    </td>
                                    <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>${item?.amount?.toFixed(2)}</td>
                                    
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
            pageCount={pages}
            currentPage={currentPage}
            setPage={setCurrentPage}
            />
        </div>
        </section>
    )
}

export default CashWallet
