import React, { useEffect, useRef, useState } from 'react'
import { useDispatch , useSelector } from 'react-redux';
import { getAllUsers } from '../../../redux/actions/userActions';
import { setCurrentPage } from '../../../redux/reducers/userReducer';
import Loader from '../../global/Loader';
import ItemNotFound from '../../global/ItemNotFound';
import moment from 'moment';
import Pagination from '../../global/pagination';
import { useNavigate } from 'react-router-dom';
import useClickOutside from '../../../utils/clickOutside';
import { Link } from 'react-router-dom';

const AllUsers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { users , loading , currentPage , pages , docsCount } = useSelector(state => state.user);

    const dropMenuRef = useRef(null);
    const [showDropMenu , setShowDropMenu] = useState(false);
    const [selectedMenuIndex , setSelectedMenuIndex]  = useState(0);

    useClickOutside(dropMenuRef , () => setShowDropMenu(false));

    useEffect(() => {
        dispatch(getAllUsers())
    }, [currentPage]);

    console.log(users)

    return (
        <section className='p-10'>
        {/* header */}
            <header className='font-semibold text-xl '>
                All Users <span className='bg-primary text-white mx-4 px-2 rounded text-base py-1 '>{docsCount}</span>
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
                    users?.length > 0 
                    ? 
                        <table className='w-full '>
                            <thead >
                                <tr className='bg-black '>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>#</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>NAME</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>EMAIL</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>PHONE</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>SPONSER</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>TOTAL INVEST</th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>ACTIONS</th> 
                                </tr> 
                            </thead>
                            <tbody>
                                {
                                users?.map((item, index) => {
                                    return (
                                    <tr key={index} className='border-b'>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>{index+1}</td>
                                        <td 
                                        className='text-center px-5 text-sm whitespace-nowrap font-medium py-4 underline cursor-pointer'
                                        
                                        >
                                            <div onClick={() => navigate(`/users/user-details/${item?._id}`)}>
                                                {item?.username}
                                            </div>
                                        </td>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>
                                            {item?.email || '//'}
                                        </td>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4'>
                                            {item?.phone || '//'}
                                        </td>
                                        <td className='text-center px-5 text-sm whitespace-nowrap font-medium py-4 underline cursor-pointer'>
                                            <div onClick={() => navigate(`/users/user-details/${item?.referrer?._id}`)}>
                                                {item?.referrer?.username || '//'}
                                            </div>
                                        </td>
                                        <td className='text-center py-4 px-5 text-sm whitespace-nowrap font-medium'>
                                        <span className='gradient-1 px-8 py-1 rounded-lg text-white border'>
                                            {item?.activePackage?.depositAmount || '//'}
                                        </span>
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
                                                    <div className='absolute top-10  bg-white shadow-lg w-[120px] h-auto rounded-lg z-[50] border flex flex-col'
                                                    ref={dropMenuRef}
                                                    >
                                                        <Link to={`/users/user-details/${item?._id}`} className='py-3 font-medium rounded-xl hover:bg-gray-100 px-4 cursor-pointer flex items-center gap-1'>
                                                            <span>View</span>
                                                        </Link>
                                                        <Link
                                                        to={`/users/edit-user/${item?._id}`} 
                                                        className='py-3 font-medium hover:bg-gray-100 px-4 cursor-pointer'>
                                                            Edit
                                                        </Link>
                                                        <div className='py-3 font-medium hover:bg-gray-100 px-4 cursor-pointer'>
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

export default AllUsers
