import React, { useEffect, useRef, useState } from 'react'
import SettingsSvg from '../../../assets/svgs/SettingsSvg'
import DownArrow from '../../../assets/svgs/DownArrow'
import View from '../../../assets/svgs/View'
import useClickOutside from '../../../Helpers/useClickOutside'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deletePackage, getPackages } from '../../../redux/actions/packageActions';
import Loader from '../../../Components/global/Loader';
import ItemNotFound from '../../../Components/global/ItemNotFound';

const PackagesTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading , packages } = useSelector(state => state.package);

    const [isView, setIsView] = useState(false);
    const [isIndex, setIsIndex] = useState(null);
    const viewRef = useRef(null)

    const viewIndex = (index) => {
        setIsIndex(index)
        setIsView(true)
    }

    useEffect(() => {
        const fetchPackages = () => {
            dispatch(getPackages(2))
        }
        fetchPackages()
    }, [])

    useClickOutside(viewRef, () => setIsView(false));

    const editHandler = (packageId) => {
        navigate(`/special-packages/edit/${packageId}`)
    }

    const deleteHandler = (packageId) => {
        if(window.confirm('Are you sure? You want to delete this package?')){
            setIsView(false);
            dispatch(deletePackage(packageId));
        }
    }

    const assignClickHandler = (packageId) => {
        navigate(`/special-packages/assign/${packageId}`)
    }

    return (
        <div className=' mt-10'>
        <h4 className='text-primary font-medium mx-4 my-2 '>Packages</h4>
        {
        loading 
        ? 
            <Loader />
        : 
        packages?.length > 0
        ? 
            <div className='card'>
                {/* header */}
                <div className=' p-5 py-6 flex items-center justify-end w-full '>
                    {/* <div className='border rounded-xl '>
                        <input className='px-3 rounded-l-xl outline-none py-2 text-black' type="text" placeholder='Search' />
                        <span className='border-l p-2 px-4 cursor-pointer'><i className="uil uil-search"></i></span>
                    </div> */}
                </div>
                <div className='overflow-auto '>
                    <table className='w-full '>
                        <thead >
                            <tr className='bg-black '>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                                    #
                                </th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                                    NAME
                                </th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                                    MONTHLY PROFIT
                                </th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                                    PROFIT LIMIT
                                </th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                                    PACKAGE FEE
                                </th>
                                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                packages?.map((item, index) => {
                                    return (
                                        <tr key={index} className='border-b'>
                                            <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>{index+1}
                                            </td>
                                            <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>{item?.name}
                                            </td>

                                            <td className='text-center px-5 whitespace-nowrap py-4 text-sm font-medium '>
                                                {item?.monthlyProfit}%
                                            </td>
                                            <td className='text-center px-5 whitespace-nowrap py-4 text-sm font-medium '>
                                                {item?.maximumProfitLimit}x
                                            </td>
                                            <td className='text-center px-5 whitespace-nowrap py-4 text-sm font-medium '>
                                                ${item?.packageFee}
                                            </td>
                                            <td className='text-center py-4 flex justify-center px-6 whitespace-nowrap'>
                                                <div onClick={() => viewIndex(index)} className='flex items-center justify-center gap-3 rounded-lg py-1 px-2 border gradient-3 cursor-pointer relative '>
                                                    <SettingsSvg />
                                                    <DownArrow />
                                                    {
                                                        index === isIndex && isView &&
                                                        <div ref={viewRef} to='' className='absolute left-1/2 -translate-x-[50%] top-full z-20 bg-white flex flex-col text-black w-[120px] rounded-md text-sm items-start'>
                                                            <div className='py-2 px-3 hover:bg-gray-200 w-full rounded-md text-left'
                                                            onClick={() => assignClickHandler(item?._id)}>
                                                                Assign
                                                            </div>
                                                            <div className='py-2 px-3 hover:bg-gray-200 w-full rounded-md text-left'
                                                            onClick={() => editHandler(item?._id)}>
                                                                Edit
                                                            </div>
                                                            <div className='py-2 hover:bg-gray-200 w-full rounded-md px-3 text-left'
                                                            onClick={() => {
                                                                deleteHandler(item?._id)
                                                            }}>
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
                </div>
                {/* Pagination */}
                <div className='py-7 px-5 flex items-center gap-3'>
                </div>
            </div>
        : 
            <ItemNotFound />

        }
        </div>
    )
}

export default PackagesTable
