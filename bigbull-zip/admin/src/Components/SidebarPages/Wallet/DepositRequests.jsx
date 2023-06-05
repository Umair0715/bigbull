import React, { useEffect, useRef, useState } from 'react'
import useClickOutside from '../../../Helpers/useClickOutside';
import { useDispatch , useSelector } from 'react-redux';
import { getAllSubscriptions } from '../../../redux/actions/subscriptionActions';
import { setCurrentPage } from '../../../redux/reducers/subscriptionsReducer';
import Loader from '../../global/Loader';
import ItemNotFound from '../../global/ItemNotFound';
import moment from 'moment';
import Pagination from '../../global/pagination';

const DepositRequests = () => {
    const dispatch = useDispatch();
    const { subscriptions , loading , currentPage , pages } = useSelector(state => state.subscription);

    useEffect(() => {
        dispatch(getAllSubscriptions())
    }, [currentPage]);

    return (
        <section className='p-10'>
            <header className='font-semibold text-xl '>
                Deposit History
            </header>
            <div className=' mt-5'>
                <div className='card'>
                    {/* header */}
                    <div className=' p-5 py-6 flex items-center justify-end w-full '>
                        <div className='border rounded-xl '>
                            <input className='px-3 rounded-l-xl outline-none py-2 text-black' type="text" placeholder='Search' />
                            <span className='border-l p-2 px-4 cursor-pointer'><i className="uil uil-search"></i></span>
                        </div>
                    </div>
                    {
                        loading
                        ? 
                            <Loader />
                        : 
                        subscriptions?.length > 0 
                         ? 
                            <div className='overflow-auto '>
                                <table className='w-full '>
                                    <thead >
                                        <tr className='bg-black '>
                                            <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>#</th>
                                            <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>NAME/DATE</th>
                                            <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap uppercase'>Package Name</th>
                                            <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>AMOUNT</th>
                                            <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>PAYMENT METHOD</th>
                                            <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>PACKAGE FEE</th>
                                            <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            subscriptions?.map((item, index) => {
                                                return (
                                                    <tr key={index} className='border-b'>
                                                        <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>{index+1}</td>
                                                        <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-2 '>
                                                            <p className='flex flex-col'>
                                                                <span>
                                                                    {item?.user?.username}
                                                                </span>
                                                                <small>
                                                                    {moment(item?.createdAt).format('DD MMM YYYY')}
                                                                </small>
                                                            </p>
                                                        </td>
                                                        <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>
                                                            {item?.package?.name}
                                                        </td>
                                                        <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>${item?.depositAmount}</td>
                                                        <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>
                                                            {
                                                                item?.paymentMethod === 1
                                                                ? 
                                                                'Cashwallet'
                                                                : 
                                                                'USDT'
                                                            }
                                                        </td>
                                                        <td className='text-center px-5 whitespace-nowrap py-4 text-sm font-medium '>
                                                            {item?.packageFee || '//'}
                                                        </td>
                                                       
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                    <Pagination 
                                    setPage={setCurrentPage}
                                    pageCount={pages}
                                    currentPage={currentPage}
                                    />
                                </table>
                            </div>
                        :
                            <ItemNotFound />

                    }
                  
                </div>
            </div>
        </section>
    )
}

export default DepositRequests
