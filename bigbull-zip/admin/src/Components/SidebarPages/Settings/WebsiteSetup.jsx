import React, { useEffect, useState } from 'react'
import SettingsSvg from '../../../assets/svgs/SettingsSvg';
import Axios from '../../../config/api';
import { useSelector } from 'react-redux';
import toastError from '../../../utils/toastError';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Loader from '../../global/Loader';

const initialState = {
    minimumTransfer : 30 ,
    minimumWithdraw : 50 ,
    bullTrackBonus : 0 ,
    bullTrackThreshold : 0 ,
    platformFee : 0 ,
    bullTrackPeriod : 10 
}
const WebsiteSetup = () => {
    const [data , setData] = useState(initialState);
    const [loading , setLoading] = useState(false);

    const { user } = useSelector(state => state.auth);

    const handleChange = e => {
        const { name , value } = e.target;
        setData(prev => ({...prev , [name] : value }))
    }

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const { data : { data : { doc } } } = await Axios('/settings' , {
                    headers : {
                        Authorization : `Bearer ${user?.token}`
                    }
                });
                setData(prev => ({...doc}));
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toastError(error);
            }
        }
        fetchSettings();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data : { data : { doc , message } } } = await Axios.post('/settings' , data , {
                headers : {
                    Authorization : `Bearer ${user?.token}`
                }
            });
            toast.success(message);
            setData(prev => ({...doc}));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toastError(error);
        }
    }

    return (
        <section className='p-10'>
            <header className='font-semibold text-xl '>
                Website Setup
            </header>
            {/* General Settings form */}
            <div className='flex items-center justify-center gap-2 general mt-8 mb-2' >
                <SettingsSvg />
                <span className='font-semibold '>General settings form </span>
            </div>
            <hr className='border' />
            {/* form */}
            <form className='my-4' onSubmit={handleSubmit} >
                <div className='md:flex justify-between gap-6 mt-6 '>
                    <div className='flex flex-col w-full gap-2'>
                        <label htmlFor="name">Minimum Transfer</label>
                        <input 
                        type="text" 
                        placeholder='Ex : 50'
                        name='minimumTransfer' 
                        className='card-input focus:border-primary ' 
                        value={data?.minimumTransfer}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col w-full gap-2'>
                        <label htmlFor="name">Minimum Withdraw</label>
                        <input 
                        type="text" 
                        placeholder='Ex : 50'
                        name='minimumWithdraw' 
                        className='card-input focus:border-primary ' 
                        value={data?.minimumWithdraw}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='grid sm:grid-cols-2 mt-6 gap-6 '>
                    <div className='flex flex-col w-full gap-2'>
                        <label htmlFor="name">Platform Fee</label>
                        <input 
                        type="text" 
                        placeholder='Ex : 50'
                        name='platformFee' 
                        className='card-input focus:border-primary ' 
                        value={data?.platformFee}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col w-full gap-2'>
                        <label htmlFor="name">BullTrack Bonus</label>
                        <input 
                        type="text" 
                        placeholder='Ex : 50'
                        name='bullTrackBonus' 
                        className='card-input focus:border-primary ' 
                        value={data?.bullTrackBonus}
                        onChange={handleChange}
                        />
                    </div>
                    
                </div>
                <div className='grid sm:grid-cols-2 mt-6 gap-6'>
                    <div className='flex flex-col w-full gap-2'>
                        <label htmlFor="name">BullTrack Threshold</label>
                        <input 
                        type="text" 
                        placeholder='Ex : 50'
                        name='bullTrackThreshold' 
                        className='card-input focus:border-primary ' 
                        value={data?.bullTrackThreshold}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col w-full gap-2'>
                        <label htmlFor="name">BullTrack Period</label>
                        <input 
                        type="text" 
                        placeholder='Ex : 10'
                        name='bullTrackPeriod' 
                        className='card-input focus:border-primary ' 
                        value={data?.bullTrackPeriod}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='my-20 flex justify-end mx-8'>
                    <button type='submit' className='gradient-3 border text-white rounded-lg px-20 py-2 disabled:cursor-not-allowed'
                    disabled={loading}
                    >
                        {
                            loading
                            ?
                                <ClipLoader size={20} color='white' />
                            : 
                                'Submit'
                        }
                    </button>
                </div>
            </form>
        </section>
    )
}

export default WebsiteSetup
