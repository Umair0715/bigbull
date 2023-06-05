import React, { useEffect } from 'react'
import { useDispatch , useSelector } from 'react-redux';
import { getUserBullTrackHistory } from '../../redux/actions/bullTrackWalletActions';
import { setCurrentPage } from '../../redux/reducers/bullTrackWalletHistoryReducer';
import Loader from '../global/Loader';
import ItemNotFound from '../global/ItemNotFound';
import moment from 'moment';
import Pagination from '../global/pagination';
import { useParams } from 'react-router-dom';

const BullTrackWalletHistory = () => {
    const dispatch = useDispatch();
    const { histories , loading , currentPage , pages , selectedUser } = useSelector(state => state.bullTrackWalletHistory);
    const { id } = useParams()

    useEffect(() => {
        dispatch(getUserBullTrackHistory(id))
    }, [currentPage]);

    console.log('BullTrack showing')

    return (
        <>
            <div className="main-container bg-primary h-fit rounded-xl mt-4">
                <div className="py-4 flex items-center gap-16 px-6">
                    <div className='sm:text-lg text-sm text-white font-semibold'>
                        BullTrack Wallet Balance : ${ selectedUser?.bullTrackWallet?.totalBallance?.toFixed(2) || '0.00'}
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
                                    <th className="p-3 text-sm font-medium whitespace-nowrap">User Name</th>
                                    <th className="p-3 text-sm font-medium whitespace-nowrap">Amount</th>
                                    <th className="p-3 text-sm font-medium whitespace-nowrap">Date</th>
                                    <th className="p-3 text-sm font-medium whitespace-nowrap text-center">BullTrack ID</th>
                                    </tr>
                                </thead>
                                {
                                    histories?.length > 0 
                                    &&
                                    <tbody className="text-sm text-left">
                                        {histories?.map((item , i) => {
                                        return (
                                            <tr key={i} className="border-b border-black pb-4">
                                            <td className="p-3 opacity-90 whitespace-nowrap">{i+1}</td>
                                            <td className="p-3 opacity-90 whitespace-nowrap">
                                                {item?.user?.username}
                                            </td>
                                            <td className="p-3 opacity-90 whitespace-nowrap">
                                                ${item?.amount.toFixed(2)}
                                            </td>
                                            <td className="p-3 opacity-90 whitespace-nowrap">
                                                {moment(item?.createdAt).format('DD MMM YYYY')}
                                            </td>
                                            <td className="p-3 font-thin whitespace-nowrap ">
                                                <div className='flex items-center justify-center'>
                                                    {item?.bullTrack?._id || '//'}
                                                </div>
                                            </td>
                                            </tr>
                                        );
                                        })}
                                    </tbody>
                                }
                            </table>
                            {
                                histories?.length > 0 ? '' : <ItemNotFound />
                            }
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

export default BullTrackWalletHistory
