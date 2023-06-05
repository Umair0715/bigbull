import React, { useEffect, useState } from 'react'
import { useDispatch , useSelector } from 'react-redux';
import { getSingleUserTransactionsHistory } from '../../redux/actions/transactionsHistoryActions';
import { setCurrentPage } from '../../redux/reducers/transactionsHistoryReducer';
import Loader from '../global/Loader';
import ItemNotFound from '../global/ItemNotFound';
import moment from 'moment';
import Pagination from '../global/pagination';
import { useParams } from 'react-router-dom';
import { setSelectedUser } from '../../redux/reducers/roiWalletHistoryReducer';

const CashWalletHistory = () => {
    const dispatch = useDispatch();
    const { histories , loading , currentPage , pages , selectedUser } = useSelector(state => state.transactionsHistory);
    const { user } = useSelector(state => state.auth);
    const { id } = useParams();

    useEffect(() => {
        dispatch(getSingleUserTransactionsHistory(id))
    }, [currentPage]);


    return (
        <>
            <div className="main-container bg-primary h-fit rounded-xl mt-4">
                <div className="py-4 flex sm:flex-row flex-col items-center justify-between gap-4 sm:px-6 px-2">
                    <div className='sm:text-lg text-sm text-white font-semibold'>
                        Cash Wallet Balance : ${ selectedUser?.cashWallet?.totalBallance?.toFixed(2) || '0.00' }
                    </div>
                </div>
                <div className="overflow-auto">
                    {
                        loading 
                        ? 
                            <Loader />
                        : 
                        <>
                            <table className="w-full text-white">
                                <thead className="bg-black text-left">
                                    <tr>
                                    <th className="p-3 text-sm font-medium whitespace-nowrap">#</th>
                                    <th className="p-3 text-sm font-medium whitespace-nowrap">From</th>
                                    <th className="p-3 text-sm font-medium whitespace-nowrap">To</th>
                                    <th className="p-3 text-sm font-medium whitespace-nowrap">Amount</th>
                                    <th className="p-3 text-sm font-medium whitespace-nowrap">Date</th>
                                    
                                    </tr>
                                </thead>
                                {
                                    histories?.length > 0 &&
                                    <tbody className="text-sm text-left">
                                        {histories?.map((item , i) => {
                                        return (
                                            <tr key={i} className="border-b border-black pb-4">
                                            <td className="p-3 opacity-90 whitespace-nowrap">{i+1}</td>
                                            <td className="p-3 opacity-90 whitespace-nowrap">
                                                {item?.from?.username}
                                            </td>
                                            <td className="p-3 opacity-90 whitespace-nowrap">
                                                {item?.to?.username}
                                            </td>
                                            <td className="p-3 opacity-90 whitespace-nowrap">
                                                ${item?.amount.toFixed(2)}
                                            </td>
                                            <td className="p-3 opacity-90 whitespace-nowrap">
                                                {moment(item?.createdAt).format('DD MMM YYYY')}
                                            </td>
                                            </tr>
                                        );
                                        })}
                                    </tbody>
                                }
                            </table>
                            { histories?.length > 0 ? '' : <ItemNotFound />}
                        </>
                      
                    }
                </div>
                {/*  */}
                <Pagination
                currentPage={currentPage}
                pageCount={pages}
                setPage={setCurrentPage}
                />
            </div>
        </>
    );
}

export default CashWalletHistory