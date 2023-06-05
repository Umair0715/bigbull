import React, { useEffect } from 'react'
import { useDispatch , useSelector } from 'react-redux';
import { getTeamWalletHistory } from '../../../redux/actions/teamWalletHistoryActions';
import { setCurrentPage } from '../../../redux/reducers/teamWalletHIstoryReducer';
import Loader from '../../global/Loader';
import ItemNotFound from '../../global/ItemNotFound';
import moment from 'moment';
import Pagination from '../../global/pagination';

const TeamBonus = () => {
    const dispatch = useDispatch();
    const { histories , loading , currentPage , pages } = useSelector(state => state.teamWalletHistory);

    useEffect(() => {
        dispatch(getTeamWalletHistory())
    }, [currentPage]);

    return (
        <section className='p-10'>
            <header className='font-semibold text-xl '>
                Team Bonus History
            </header>
        <div className='card mt-10'>
            {/* header */}
            <div className=' p-5 py-6 flex items-center justify-between w-full flex-wrap gap-2 rounded-t-[20px] '></div>
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
                                <th className='py-4 px-3 font-semibold text-[13px] text-left whitespace-nowrap'>FROM</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>TO</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>TEAM LEVEL</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>DATE</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>PROFIT AMOUNT</th>
            
                            </tr>
                        </thead>
                        <tbody>
                        {
                            histories?.map((item, index) => {
                            return (
                                <tr key={index} className='border-b'>
                                <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>{index+1}</td>
                                <td className='text-left px-5 whitespace-nowrap text-sm font-medium py-4 '>
                                    {item?.from?.username}
                                </td>
                                <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-2 '>
                                    <p className='flex flex-col'>
                                        <span>
                                            {item?.to?.username}
                                        </span>
                                    </p>
                                </td>
                                <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>
                                    {item?.teamLevel}
                                </td>
                                <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>
                                    {moment(item?.createdAt).format('DD MMM YYYY')}
                                </td>
                                <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>
                                    ${item?.amount.toFixed(2)}
                                </td>
        
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
            setPage={setCurrentPage}
            pageCount={pages}
            currentPage={currentPage}
            />
        </div>
        </section>
    )
}

export default TeamBonus