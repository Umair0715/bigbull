import React, { useRef, useState } from 'react'
import UserSvg from '../../../assets/svgs/UserSvg'
import { useGlobalContext } from '../../../Context/context'
import useClickOutside from '../../../Helpers/useClickOutside';
import { ClipLoader } from 'react-spinners'
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { updatePackageRequest } from '../../../redux/actions/packageRequestsActions';
import { baseURL } from '../../../config/api';

const PackageRequestModal = ({ setShowModel }) => {
    const dispatch = useDispatch();
    const selectedRequest = JSON.parse(localStorage.getItem('selectedRequest'));
    const imgRef = useRef(null)
    const modalRef = useRef(null);
    const [proof , setProof] = useState(baseURL + '/deposits/' + selectedRequest?.proof);
    const [newStatus , setNewStatus] = useState('');
    const [description , setDescription] = useState('');

    const { updateLoading } = useSelector(state => state.withdraw)

    const addImg = () => {
        imgRef.current.click()
    }


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setProof(reader.result);
        }
    }

    useClickOutside(modalRef, () => {
        setShowModel(false);
        localStorage.removeItem('selectedRequest');
        setProof('');
        setDescription('');
    });

    const updateHandler = async () => {
        console.log('clicked')
        const requestData = { status : newStatus , description };
        await dispatch(updatePackageRequest(selectedRequest?._id , requestData , setShowModel));
        setProof('');
        setDescription('');
    }

    return (
        <>
            <section  className='absolute top-0 left-0 h-screen bg-red-400 bg-opacity-40 w-full z-50'>
                    <div className='flex justify-center '>
                        {/* withdraw details */}
                        <div ref={modalRef} className='gradient-1 rounded-md mt-10 mb-20 xl:w-[30vw] lg:w-[40vw] sm:w-[50vw] w-[70vw] h-[500px] overflow-auto'>
                            <div className='flex justify-between items-center border-b px-3 py-4 gradient-1 rounded-t-[20px]'>
                                <p className='font-semibold text-lg'>Package Request</p>
                                <p className='text-xs'>
                                    {moment(selectedRequest?.createdAt).format('DD MMM YYYY')}
                                </p>
                            </div>
                            <div className='p-3 flex flex-col gap-3'>
                                <div className='border-2 flex gap-14 px-12 py-5 items-center rounded-xl gradient-2 '>
                                    <div>
                                        <UserSvg />
                                    </div>
                                    <div className='flex flex-col gap-1 '>
                                        <span >Name</span>
                                        <span className='text-sm'>
                                            {selectedRequest?.user?.username}
                                        </span>
                                        <small className='text-xs'>
                                            {selectedRequest?.user?.email}
                                        </small>
                                    </div>
                                </div>
                                <div className='border-2 flex flex-col gap-2 px-3 py-3 items-center rounded-xl gradient-2 '>
                                    <small className='font-medium '>
                                        Deposit Amount
                                    </small>
                                    <span className='text-xl'> ${selectedRequest?.depositAmount}</span>
                                </div>
                                <div className='py-3'>
                                    <p>Account Details </p>
                                    <form >
                                        <div className='flex flex-col gap-1 py-2'>
                                            <label htmlFor="username" className='text-sm' >User Name :</label>
                                            <input type="text" placeholder='username' className='px-2 py-1 rounded-lg w-full text-sm outline-none text-black font-medium ' 
                                            value={selectedRequest?.user?.username}
                                            readOnly
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1 py-2'>
                                            <label htmlFor="address" className='text-sm' >TxId :</label>
                                            <input type="text" placeholder='address....' className='px-2 py-1 rounded-lg w-full text-sm outline-none text-black font-medium ' 
                                            value={selectedRequest?.txId}
                                            readOnly
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1 py-2'>
                                            <label htmlFor="amount" className='text-sm' >Status:</label>
                                            {
                                                selectedRequest?.status === 'pending'
                                                ?
                                                <select
                                                className='px-2 py-1 rounded-lg w-full text-sm outline-none text-black font-medium'
                                                onChange={e => {
                                                    setNewStatus(e.target.value);
                                                }}
                                                >
                                                    <option value='pending'>
                                                        Pending
                                                    </option>
                                                    <option value="approved">
                                                        Approved
                                                    </option>
                                                    <option value="declined">
                                                        Declined
                                                    </option>
                                                </select>
                                                :
                                                <input type="text" placeholder='1000' className='px-2 py-1 rounded-lg w-full text-sm outline-none text-black font-medium ' 
                                                value={selectedRequest?.status}
                                                readOnly
                                                />
                                            }
                                        </div>
                                        <div className='flex flex-col gap-1 py-2'>
                                            <label 
                                            htmlFor="amount" 
                                            className='text-sm' 
                                            >
                                                Description :
                                            </label>
                                            <input 
                                            placeholder='Enter Description'
                                            type="text" 
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            className='input'
                                            />
                                        </div>
                                       
                                        <>
                                            <div className='flex justify-center py-2 '>
                                                <img  src={proof || '/images/add.svg'} 
                                                alt="" className='cursor-pointer' />
                                            </div>
                                            <div className='px-10'>
                                                <button className='gradient-3 w-full border py-2 rounded-lg disabled:cursor-not-allowed' 
                                                type='button'
                                                onClick={updateHandler}
                                                disabled={!description || !newStatus}
                                                >
                                                    {
                                                        updateLoading 
                                                        ? 
                                                            <ClipLoader size={20} color='white'
                                                            />
                                                        : 
                                                            'Update'
                                                    }
                                                </button>
                                            </div>
                                        </>
                                           

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
            </section>
        </>
    )
}

export default PackageRequestModal
