import { useEffect, useState  } from "react";
import Axios, { baseURL } from '../../../config/api';
import { useParams } from 'react-router-dom'
import toastError from '../../../utils/toastError';
import Loader from '../../../Components/global/Loader';
import DefualtProfileImage from '../../../assets/images/profile.png';
import RoiWalletHistory from '../../userDetails/RoiWalletHistory';
import CashWalletHistory from '../../userDetails/CashWalletHistory';
import BullTrackWalletHistory from '../../userDetails/BullTrackWalletHistory';
import TeamWalletHistory from '../../userDetails/TeamWalletHistory';


const UserDetails = () => {
    const { id } = useParams();
    const [user , setUser] = useState('');
    const [loading , setLoading] = useState(false);
    const [showHistory , setShowHistory] = useState(1); // 1 = ROI , 2 = Team wallet , 3 = Bull Track , 4 = Cash 

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const { data : { data : { doc } } } = await Axios(`/user/details/${id}`);
                setUser(doc)
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toastError(error);
            }
        }
        fetchUser();
    }, []);

    console.log(showHistory)


    return (
        <section className='p-10'>
            <header className='font-semibold text-xl '>
                User Details
            </header>
            {
                loading 
                ? 
                    <Loader />
                : 
                user 
                ? 
                    <div>
                        <div className="flex gap-8 mt-8">
                            <div>
                                <img 
                                src={user?.image ? `${baseURL}/users/${user?.image}` : DefualtProfileImage } 
                                alt={user?.username}
                                className="sm:w-[150px] w-[100px] sm:h-[150px] h-[100px] object-cover rounded-full"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className='flex items-center'>
                                    <p className="w-[200px]">Name : </p> 
                                    <p>{user?.name}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-[200px]'>Username : </p> 
                                    <p>{user?.username}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-[200px]'>Email : </p> 
                                    <p>{user?.email}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-[200px]'>Phone : </p> 
                                    <p>{user?.phone}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-[200px]'>Address : </p> 
                                    <p>{user?.address}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-[200px]'>Gender : </p> 
                                    <p>{user?.gender}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-[200px]'>Country : </p> 
                                    <p>{user?.country}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-[200px]'>Deposit Amount : </p>
                                    <p>${user?.activePackage?.depositAmount || '0.00' }</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-12">
                            <div className="flex items-centet justify-between">
                                <h3 className="text-xl font-medium flex-1">
                                    Histories
                                </h3>
                                <select 
                                className="w-fit text-black outline:none py-1.5 px-4 rounded-md"
                                onChange={e => setShowHistory(e.target.value)}
                                >
                                    <option value={1}>Roi Wallet History</option>
                                    <option value={2}>Team Wallet History</option>
                                    <option value={3}>BullTrack Wallet History</option>
                                    <option value={4}>Cash Wallet History</option>
                                </select>
                            </div>
                            <div className="mt-6">
                                {
                                    parseInt(showHistory) === 1 
                                    ? 
                                        <RoiWalletHistory />
                                    : 
                                    parseInt(showHistory) === 2 
                                    ? 
                                        <TeamWalletHistory />
                                    : 
                                    parseInt(showHistory) === 3 
                                    ? 
                                        <BullTrackWalletHistory />
                                    : 
                                    parseInt(showHistory) === 4 
                                    ? 
                                        <CashWalletHistory />
                                    : 
                                        <CashWalletHistory />
                                }
                            </div>
                        </div>
                    </div>
                : 
                    <div>User Not Found.</div>
            }

        </section>
    )
}

export default UserDetails
