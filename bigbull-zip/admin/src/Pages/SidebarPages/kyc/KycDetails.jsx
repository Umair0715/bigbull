import React, { useEffect, useRef, useState } from 'react'
import {  useSelector } from 'react-redux';
import Loader from '../../../Components/global/Loader';
import ItemNotFound from '../../../Components/global/ItemNotFound';
import moment from 'moment';
import Pagination from '../../../Components/global/pagination';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Axios, { baseURL } from '../../../config/api';
import toastError from '../../../utils/toastError';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const statuses = [
    {
        id : 1 ,
        value : 'approved' ,
        label : 'Approved'
    } ,
    {
        id : 2 ,
        value : 'pending' ,
        label : 'Pending'
    } ,
    {
        id : 3 ,
        value : 'declined' ,
        label : 'Declined'
    } ,
]

const KycDetails = () => {
    const navigate = useNavigate();
    const [kyc , setKyc] = useState([]);
    const [loading , setLoading] = useState(false);
    const [updateLoading , setUpdateLoading] = useState(false);
    const { id } = useParams();
    const { user } = useSelector(state => state.auth);
    const [status , setStatus] = useState('');

    useEffect(() => {
        const fetchKyc = async () => {
            try {
                setLoading(true);
                const { data : { data : { doc } } } = await Axios(`/kyc/${id}` , {
                    headers : {
                        Authorization : `Bearer ${user?.token}`
                    }
                });
                setKyc(doc);
                setStatus(doc?.status)
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toastError(error);
            }
        }
        fetchKyc();
    }, []);

    const updateKycHandler = async () => {
        try {
            setUpdateLoading(true);
            const { data : { data : { doc , message } } } = await Axios.put(`/kyc/update/${id}` , { status } , {
                headers : {
                    Authorization : `Bearer ${user?.token}`
                }
            });
            toast.success(message);
            setKyc(doc);
            setStatus(doc?.status)
            setUpdateLoading(false);
        } catch (error) {
            setUpdateLoading(false);
            toastError(error);
        }
    }


    return (
        <section className='p-10'>
        {/* header */}
            <header className='font-semibold text-xl '>
                Kyc Details 
            </header>
        {/* list container */}
        <div className='my-8'>
            <div className='card p-1'>
            
            {/* table */}
            <div className='overflow-auto '>
                {
                    loading 
                    ? 
                        <Loader />
                    : 
                    kyc  
                    ? 
                        <div className='flex flex-col gap-6 bg-black p-4 rounded-lg'>
                            <div>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='font-semibold w-[150px]'>Username : </h3>
                                        <p>{kyc?.user?.username}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='font-semibold w-[150px]'>Email : </h3>
                                        <p>{kyc?.user?.email}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='font-semibold w-[150px]'>Phone : </h3>
                                        <p>{kyc?.user?.phone}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='font-semibold w-[150px]'>Status : </h3>
                                        <p>{kyc?.status}</p>
                                    </div>
                                </div>                                
                            </div>
                            <div className='flex gap-4'>
                                <div className='flex-1 flex flex-col gap-2'>
                                    <h3>CNIC Front Image</h3>
                                    <div>
                                        <img 
                                        src={`${baseURL}/kyc/${kyc?.CNICFrontImage}`} 
                                        alt="kyc" 
                                        className='w-full h-[200px] rounded-md object-cover'
                                        />
                                    </div>
                                </div>
                                <div className='flex-1 flex flex-col gap-2'>
                                    <h3>CNIC Back Image</h3>
                                    <div>
                                        <img 
                                        src={`${baseURL}/kyc/${kyc?.CNICBackImage}`} 
                                        alt="kyc"
                                        className='w-full h-[200px] rounded-md object-cover' 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex gap-4'>
                                <div className='flex-1 flex flex-col gap-2'>
                                    <h3>Nominee CNIC Front Image</h3>
                                    <div>
                                        <img 
                                        src={`${baseURL}/kyc/${kyc?.nomineeCNICFrontImage}`} 
                                        alt="kyc" 
                                        className='w-full h-[200px] rounded-md object-cover'
                                        />
                                    </div>
                                </div>
                                <div className='flex-1 flex flex-col gap-2'>
                                    <h3>Nominee CNIC Back Image</h3>
                                    <div>
                                        <img 
                                        src={`${baseURL}/kyc/${kyc?.nomineeCNICBackImage}`} 
                                        alt="kyc"
                                        className='w-full h-[200px] rounded-md object-cover' 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-semibold'>
                                        Update Status
                                    </label>
                                    <select 
                                    className='w-[200px] py-2 px-4 text-black rounded-full' 
                                    defaultValue={status}
                                    onChange={e => {
                                        setStatus(e.target.value)
                                    }}
                                    >
                                        {
                                            statuses?.map((item) => {
                                                return <option 
                                                key={item.id} 
                                                value={item?.value}
                                                >
                                                    {item?.label}
                                                </option>
                                            })
                                        }
                                        
                                    </select>
                                </div>
                                <div className='mt-4'>
                                    <button
                                    disabled={status === kyc?.status} 
                                    className="btn-primary text-center disabled:cursor-not-allowed w-fit" 
                                    onClick={updateKycHandler}
                                    >
                                        {
                                            updateLoading
                                            ? 
                                                <ClipLoader size={20} color='white'/>
                                            : 
                                                'Save'
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    : 
                        <ItemNotFound />

                }
            </div>
           
            </div>
        </div>
        </section>
    )
}

export default KycDetails
