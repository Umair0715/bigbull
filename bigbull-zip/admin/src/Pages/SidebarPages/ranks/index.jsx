import React, { useEffect, useRef, useState } from 'react'
import Loader from '../../../Components/global/Loader';
import Pagination from '../../../Components/global/pagination';
import useClickOutside from '../../../utils/clickOutside';
import { Link } from 'react-router-dom';
import Axios, { baseURL } from '../../../config/api';
import toastError from '../../../utils/toastError';
import ItemNotFound from '../../../Components/global/ItemNotFound';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Ranks = () => {
    const [loading , setLoading] = useState(false);
    const [ranks , setRanks] = useState([]);

    const dropMenuRef = useRef(null);
    const [showDropMenu , setShowDropMenu] = useState(false);
    const [selectedMenuIndex , setSelectedMenuIndex]  = useState(0);

    const { user } = useSelector(state => state.auth); 

    useClickOutside(dropMenuRef , () => setShowDropMenu(false));

    const deleteHandler = async (item) => {
        setShowDropMenu(false)
        if(window.confirm('Are you sure? You want to delete this rank?')){
            try {
                setLoading(true);
                const { data : { data : { message } } } = await Axios.delete(`/rank/${item?._id}` , {
                    headers : {
                        Authorization : `Bearer ${user?.token}`
                    }
                });
                toast.success(message);
                setRanks(prev => prev.filter(r => r._id !== item._id))
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toastError(error);
            }
        }
    }

    useEffect(() => {
        const fetchRanks = async () => {
            try {
                setLoading(true);
                const { data : { data : { docs } } } = await Axios('/rank');
                setRanks(docs);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toastError(error);
            }
        }
        fetchRanks();
    }, [])


    return (
        <section className='p-10'>
        {/* header */}
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-xl '>
                    All Ranks 
                </h1>
                <Link to='/ranks/add-new' className='bg-white py-2 px-6 rounded-md text-black'>
                    Add New Rank
                </Link>
            </div>
        {/* list container */}
        <div className='my-8'>
            <div className='card'>
            <div className=' p-5 py-6 flex items-center justify-end w-full '></div>
            <div className='overflow-auto '>
                {
                    loading 
                    ? 
                        <Loader />
                    : 
                    ranks?.length > 0 
                    ? 
                        <table className='w-full '>
                            <thead >
                                <tr className='bg-black rounded-lg'>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>#</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>NAME</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>Achieve Amount</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>Image</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>Created</th>
                                 <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>ACTIONS</th> 
                                </tr> 
                            </thead>
                            <tbody>
                                {
                                ranks?.map((item, index) => {
                                    return (
                                    <tr key={index} className='border-b'>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>{index + 1}</td>
                                        <td 
                                        className='text-center px-5 text-sm whitespace-nowrap font-medium py-4 underline cursor-pointer'
                                        
                                        >
                                            <div>
                                                {item?.name}
                                            </div>
                                        </td>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>
                                            ${item?.achieveAmount}
                                        </td>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>
                                            <div className='flex items-center justify-center'>
                                                <img 
                                                src={`${baseURL}/ranks/${item?.image}`} 
                                                alt={item?.name} 
                                                />
                                            </div>
                                        </td>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>
                                            {moment(item?.createdAt).format('DD MMM YYYY')}
                                        </td>
                                        <td className=" text-gray-900  px-6 py-4 whitespace-nowrap ">
                                            <div className='flex items-end justify-center relative' 
                                            >  
                                                <div className='bg-gray-200 py-1.5 px-4 flex items-center rounded-md text-pure gap-2 text-lg w-fit cursor-pointer'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowDropMenu(prev => !prev);
                                                    setSelectedMenuIndex(index);
                                                }}
                                                >
                                                    <div><i className="uil uil-setting"></i></div>
                                                    <div><i className="uil uil-angle-down"></i></div>
                                                </div>
                                                {/* DROP MENU */}
                                                {   
                                                    showDropMenu && selectedMenuIndex === index &&
                                                    <div className='absolute top-10  bg-white shadow-lg w-[120px] h-auto rounded-lg z-[50] flex flex-col'
                                                    ref={dropMenuRef}
                                                    >
                                                        <Link to={`/ranks/edit/${item?._id}`} className='py-3 font-medium rounded-xl hover:bg-gray-100 px-4 cursor-pointer flex items-center gap-1'>
                                                            <span>Edit</span>
                                                        </Link>
                                                        <div className='py-3 font-medium hover:bg-gray-100 px-4 cursor-pointer'
                                                        onClick={() => deleteHandler(item)}>
                                                            Delete
                                                        </div>

                                                    </div>
                                                }
                                            </div>
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
            {/* <Pagination 
            pageCount={pages}
            currentPage={currentPage}
            setPage={setCurrentPage}
            /> */}
            </div>
        </div>
        </section>
    )
}

export default Ranks