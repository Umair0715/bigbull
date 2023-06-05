import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify";
import Axios from "../../../config/api";
import toastError from '../../../utils/toastError';
import { ClipLoader } from "react-spinners";
import Select from 'react-select';
import debounce from 'lodash/debounce';
import SelectBox from '../../../Components/global/SelectBox';


const wallets = [
    {
        value : 1 , 
        label : 'ROIWallet'
    } ,
    {
        value : 2 , 
        label : 'TeamWallet'
    } ,
    {
        value : 3 , 
        label : 'BullTrack Wallet'
    } ,
    {
        value : 4 , 
        label : 'Cash Wallet'
    } ,
]


const TransferAmount = () => {
    const { user } = useSelector(state => state.auth);
    const [amount , setAmount] = useState(0);
    const [loading , setLoading] = useState(false);
    const [users , setUsers] = useState([]);
    const [to , setTo] = useState('');
    const [searchLoading , setSearchLoading] = useState(false);
    const [walletType , setWalletType] = useState(1);
 

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            let _data = {
                amount , user : to?._id  , walletType
            } 

            const { data : { data : { message } } } = await Axios.post('/admin/transfer-amount' , _data , {
                headers : {
                    Authorization : `Bearer ${user?.token}`
                }
            });
            setAmount(0);
            setWalletType(1);
            setTo('')
            toast.success(message);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toastError(error);
        }
    }

    const searchUsers = async (query) => {
        try {
            setSearchLoading(true);
            const { data : { data : { docs } } } = await Axios(`/user/search?keyword=${query}`);
            setUsers(docs?.filter(doc => doc?._id !== user?._id)); 
            setSearchLoading(false);
        } catch (error) {
            setSearchLoading(false);
            toastError(error);
        }
    }
    
    const debouncedSearch = debounce(searchUsers , 500);
    const handleInputChange = (value) => {
        debouncedSearch(value);
    };

    return (
        <div className="container p-4">
            <div className="bg-black rounded-xl border">
                <div className="topbar-gradient rounded-xl flex items-center justify-between text-white sm:px-6 px-3 py-6">
                    <h2 className="sm:text-2xl text-lg font-bold">Transfer</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className=" grid md:grid-cols-2 grid-cols-1 gap-4 sm:px-6 px-3 py-8 pb-4">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-primary font-semibold">Payment Amount</h2>
                            <input
                            type="number"
                            placeholder="Ex : 4000"
                            className="input"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-primary font-semibold">
                                Transfer to
                            </h2>
                            <SelectBox 
                            options={wallets?.map(item => ({
                                label : item?.label , value : item?.value 
                            }))} 
                            setValue={setWalletType}
                            value={walletType}
                            />
                        </div>
                        <div>
                            <h2 className="text-primary font-semibold flex items-center gap-2">
                                <span>User Name</span>
                                {
                                    searchLoading
                                    ? 
                                        <ClipLoader size={15} color='white' />
                                    : ''
                                }
                            </h2>
                            <Select
                            onInputChange={handleInputChange}
                            options={users?.map(item => (
                                {
                                    value : item , label : item?.username
                                }
                            ))}
                            inputId="input"
                            styles={ {
                                control: (provided) => ({
                                    ...provided,
                                    padding: '4px 4px' ,
                                    color : 'black'
                                }),
                                option: provided => ({
                                    ...provided,
                                    color: 'black'
                                }),
                            }}
                            onChange={(e) => {
                                setTo(e.value)
                            }}
                            />
                        </div>
                    </div>
                    {
                        to && amount > 0 && 
                        <div className="text-white sm:px-6 px-3 pb-4  sm:text-xl font-semibold flex flex-col gap-2">
                            <div className="flex items-center gap-8">
                                <h3 className="w-[200px]">Account Name : </h3>
                                <p>{to?.name}</p>
                            </div>
                        </div>
                    }

                    
                    <div>
                        <div className="pt-4 pb-8 sm:px-6 px-3">
                            <button 
                            className="gradient-3 border text-white px-8 py-2 rounded-lg disabled:cursor-not-allowed"
                            disabled={!amount}
                            >
                                {
                                    loading 
                                    ? 
                                        <ClipLoader size={20} color='white' />
                                    : 
                                        'Send'
                                }
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TransferAmount
