import React, { useEffect, useRef, useState } from 'react'
import Axios from '../../../config/api';
import toastError from '../../../utils/toastError';
import moment from 'moment';
import Pagination from '../../global/pagination';
import { useSelector } from 'react-redux';
import Loader from '../../global/Loader';
import ItemNotFound from '../../global/ItemNotFound';

const TransferHistory = () => {
    const [histories , setHistories] = useState([]);
    const [pages , setPages] = useState(1);
    const [currentPage , setCurrentPage] = useState(1);
    const [docsCount , setDocsCount] = useState(1);
    const [loading , setLoading] = useState(false);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const { data : { data : { docs , pages , page , docCount } } } = await Axios('/admin/transfer-history' , {
                    headers : {
                        Authorization : `Bearer ${user?.token}`
                    }
                });
                setHistories(docs);
                setPages(pages);
                setCurrentPage(page);
                setDocsCount(docCount);
                setLoading(false);   
            } catch (error) {
                setLoading(false);
                toastError(error);
            }
        }
        fetchHistory();
    },[currentPage])


    return (
        <section className='p-10'>
            <header className='font-semibold text-xl '>
                History
            </header>
            <div className=' mt-10'>
                {
                    loading 
                    ? 
                        <Loader size={20} color='white' />
                    : 
                        <div className='card'>
                            {/* header */}
                            <div className=' p-5 py-6 flex items-center justify-end w-full '>
                            </div>
                            <div className='overflow-auto '>
                                <table className='w-full '>
                                    <thead >
                                        <tr className='bg-black '>
                                            <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>#</th>
                                            <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>AMOUNT</th>
                                            <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>DATE</th>
                                            <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>DESCRIPTION</th>
                                        </tr>
                                    </thead>
                                    {
                                        histories?.length > 0 &&
                                        <tbody>
                                            {
                                                histories?.map((item, index) => {
                                                    return (
                                                        <tr key={index} className='border-b'>
                                                            <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>{index+1}</td>
                                                            <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>
                                                                ${item?.amount}
                                                            </td>
                                                            <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-2 '>
                                                                {
                                                                    moment(item?.createdAt).format('DD MMM YYYY')
                                                                }
                                                            </td>
                                                            <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>
                                                                {item?.description}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    }
                                </table>
                            </div>
                            { histories.length > 0 ? '' : <ItemNotFound />}
                            {/* Pagination */}
                            <Pagination
                            setPage={setCurrentPage}
                            pageCount={pages}
                            currentPage={currentPage}
                            />
                        </div>
                    
                }
            </div>
        </section>
    )
}

export default TransferHistory
