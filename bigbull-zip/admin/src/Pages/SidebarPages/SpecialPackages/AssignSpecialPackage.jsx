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
import { useParams } from 'react-router-dom';
import Loader from '../../../Components/global/Loader';


const AssignSpecialPackage = () => {
    const { user } = useSelector(state => state.auth);
    const [depositAmount , setDepositAmount] = useState(0);
    const [loading , setLoading] = useState(false);
    const [users , setUsers] = useState([]);
    const [searchLoading , setSearchLoading] = useState(false);
    const [selectedUser , setSelectedUser] = useState('');
    const [fetchLoading , setFetchLoading] = useState(false);
    const [selectedPackage , setSelectedPackage] = useState('');
    const { packageId } = useParams();

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                setFetchLoading(true);
                const { data : { data : { doc } } } = await Axios(`/packages/${packageId}` , {
                    headers : {
                        Authorization : `Bearer ${user?.token}`
                    }
                });
                setSelectedPackage(doc);
                setFetchLoading(false);
            } catch (error) {
                setFetchLoading(false)
                toastError(error);
            }
        }
        fetchPackage();
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            let subscriptionData = {
                depositAmount , userId : selectedUser?._id  , packageId 
            } 
            const { data : { data : { message } } } = await Axios.post('/subscription/special-package' , subscriptionData , {
                headers : {
                    Authorization : `Bearer ${user?.token}`
                }
            });
            setUsers([]);
            setSelectedUser('');
            setDepositAmount(0);
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
                    <h2 className="sm:text-2xl text-lg font-bold">
                        Assign Special Package
                    </h2>
                </div>
                {
                    fetchLoading 
                    ? 
                        <Loader />
                    : 
                        <form onSubmit={handleSubmit}>
                            <div className=" grid md:grid-cols-2 grid-cols-1 gap-4 sm:px-6 px-3 py-8 pb-4">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-primary font-semibold">
                                        Deposit Amount
                                    </h2>
                                    {
                                        selectedPackage && 
                                        <SelectBox 
                                        options={selectedPackage?.depositRange?.map(item => ({
                                            label : item , value : parseInt(item) 
                                        }))} 
                                        setValue={setDepositAmount}
                                        value={depositAmount}
                                        />
                                    }
                                </div>
                                <div className='flex flex-col gap-2 w-full flex-1 '>
                                    <label>Package Name</label>
                                    <input 
                                    type="text" 
                                    className='card-input focus:border-primary' 
                                    value={selectedPackage?.name}
                                    readOnly
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
                                        setSelectedUser(e.value)
                                    }}
                                    // value={selectedUser}
                                    />
                                </div>
                            </div>
                            {
                                selectedUser && 
                                <div className="text-white sm:px-6 px-3 pb-4  sm:text-xl font-semibold flex flex-col gap-2">
                                    <div className="flex items-center gap-8">
                                        <h3 className="w-[200px]">Account Name : </h3>
                                        <p>{selectedUser?.name}</p>
                                    </div>
                                </div>
                            }

                            
                            <div>
                                <div className="pt-4 pb-8 sm:px-6 px-3">
                                    <button 
                                    className="gradient-3 border text-white px-8 py-2 rounded-lg disabled:cursor-not-allowed"
                                    disabled={!depositAmount}
                                    >
                                        {
                                            loading 
                                            ? 
                                                <ClipLoader size={20} color='white' />
                                            : 
                                                'Done'
                                        }
                                    </button>
                                </div>
                            </div>
                        </form>

                }
            </div>
        </div>
    )
}

export default AssignSpecialPackage
