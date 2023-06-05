import React from 'react'
import Axios from '../../../config/api';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import toastError from '../../../utils/toastError'
import { useEffect } from 'react';
import ItemNotFound from '../../../Components/global/ItemNotFound';
import Pagination from '../../../Components/global/pagination';
import Loader from '../../../Components/global/Loader';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'

const AchievedRanks = () => {
    const navigate = useNavigate();
    const [loading , setLoading] = useState(false);
    const [achievedRanks , setAchievedRanks] = useState([]);
    const { user } = useSelector(state => state.auth);
    const [pages , setPages] = useState(1);
    const [currentPage , setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchAchievedRanks = async () => {
            try {
                setLoading(true);
                const { data : { data : { docs , page , pages } } } = await Axios('/achieved-rank' , {
                    headers : {
                        Authorization : `Bearer ${user?.token}`
                    }
                });
                setAchievedRanks(docs);
                setPages(pages);
                setCurrentPage(page);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toastError(error);
            }
        }
        fetchAchievedRanks();
    }, []);

    return (
        <section className='p-10'>
        {/* header */}
            <header className='font-semibold text-xl '>
                Achieved Ranks
            </header>
        {/* list container */}
        <div className='my-8'>
            <div className='card'>
            {/* header */}
            <div className=' p-5 py-6 flex items-center justify-end w-full '>
                <div className='border rounded-xl  '>
                <input className='px-3 rounded-l-xl  outline-none py-2 text-black' type="text" placeholder='Search' />
                <span className='border-l  p-2 px-4 cursor-pointer'><i className="uil uil-search"></i></span>
                </div>
            </div>
            {/* table */}
            <div className='overflow-auto '>
                {
                    loading 
                    ? 
                        <Loader />
                    : 
                    achievedRanks?.length > 0 
                    ? 
                        <table className='w-full '>
                            <thead >
                                <tr className='bg-black '>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>#</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>Username</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>Achieved Rank</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>Amount</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>Time</th>
                                 </tr>
                            </thead>
                            <tbody>
                                {
                                achievedRanks?.map((item, index) => {
                                    return (
                                    <tr key={index} className='border-b'>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>{index+1}</td>
                                        <td 
                                        className='text-center px-5 text-sm whitespace-nowrap font-medium py-4  cursor-pointer underline'
                                        >
                                            <div onClick={() => navigate(`/users/user-details/${item?.user?._id}`)}>
                                                {item?.user?.username}
                                            </div>
                                        </td>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>
                                            {item?.rank?.name || '//'}
                                        </td>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>
                                            {item?.rank?.achieveAmount || '//'}
                                        </td>
                                        <td className='text-center py-4 px-5 text-sm whitespace-nowrap font-medium'>
                                            {moment(item?.createdAt).format('DD MMM YYYY')}
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

export default AchievedRanks