import React, { useEffect, useRef, useState } from 'react'
import {  useSelector } from 'react-redux';
import Loader from '../../../Components/global/Loader';
import ItemNotFound from '../../../Components/global/ItemNotFound';
import moment from 'moment';
import Pagination from '../../../Components/global/pagination';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Axios, { baseURL } from '../../../config/api';
import toastError from '../../../utils/toastError';

const Kycs = () => {
    const navigate = useNavigate();
    const [kycs , setKycs] = useState([]);
    const [currentPage , setCurrentPage] = useState(1);
    const [pages , setPages] = useState(1);
    const [docsCount , setDocsCount] = useState(1);
    const [loading , setLoading] = useState(false);

    const { user } = useSelector(state => state.auth);


    useEffect(() => {
        const fetchKycs = async () => {
            try {
                setLoading(true);
                const { data : { data : { docs , page , pages , docCount } } } = await Axios('/kyc' , {
                    headers : {
                        Authorization : `Bearer ${user?.token}`
                    }
                });
                setKycs(docs);
                setCurrentPage(page);
                setPages(pages);
                setDocsCount(docCount)
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toastError(error);
            }
        }
        fetchKycs();
    }, [currentPage]);

    console.log(kycs)

    return (
        <section className='p-10'>
        {/* header */}
            <header className='font-semibold text-xl '>
                All Kycs <span className='bg-primary text-white mx-4 px-2 rounded text-base py-1'>{docsCount}</span>
            </header>
        {/* list container */}
        <div className='my-8'>
            <div className='card pt-6'>
            
            {/* table */}
            <div className='overflow-auto '>
                {
                    loading 
                    ? 
                        <Loader />
                    : 
                    kycs?.length > 0 
                    ? 
                        <table className='w-full'>
                            <thead >
                                <tr className='bg-black '>
                                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>#</th>
                                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>USERNAME</th>
                                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>EMAIL</th>
                                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>PHONE</th>
                                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>WALLET ADDRESS</th>
                                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                                        STATUS
                                    </th>
                                    <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                                        VIEW
                                    </th> 
                                </tr> 
                            </thead>
                            <tbody>
                                {
                                kycs?.map((item, index) => {
                                    return (
                                    <tr key={index} className='border-b'>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>{index+1}</td>
                                        <td 
                                        className='text-center px-5 text-sm whitespace-nowrap font-medium py-4 underline cursor-pointer'
                                        
                                        >
                                            <div onClick={() => navigate(`/users/user-details/${item?._id}`)}>
                                                {item?.user?.username}
                                            </div>
                                        </td>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>
                                            {item?.user?.email || '//'}
                                        </td>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>
                                            {item?.user?.phone || '//'}
                                        </td>
                                        <td className='text-center py-4 px-5 text-sm whitespace-nowrap font-medium'>
                                            {item?.walletAddress || '//'}
                                        </td>
                                        <td className=" text-white px-6 py-4 whitespace-nowrap text-sm text-center">
                                           {item?.status ||'//'} 
                                        </td>
                                        <td className=" text-white px-6 py-4 whitespace-nowrap text-sm">
                                            <Link to={`/kycs/details/${item._id}`} className='underline text-white cursor-pointer '>
                                                details
                                            </Link> 
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
            pageCount={pages}
            currentPage={currentPage}
            setPage={setCurrentPage}
            />
            </div>
        </div>
        </section>
    )
}

export default Kycs
