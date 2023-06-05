import React, { useRef, useState } from "react";
import Input from "../../../Components/global/Input";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import Axios, { baseURL } from "../../../config/api";
import { toast } from "react-toastify";
import toastError from '../../../utils/toastError';
import isBase64 from '../../../utils/isBase64';
import DefaultProfileImage from "../../../assets/images/profile.png"; 
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import Loader from "../../../Components/global/Loader";

const EditUser = () => {
    const dispatch = useDispatch();
    const [name , setName] = useState('');
    const [username , setUsername] = useState('');
    const [email , setEmail] = useState('');
    const [phone , setPhone] = useState('');
    const [gender , setGender] = useState('');
    const [address , setAddress] = useState('');
    const [country , setCountry] = useState('');
    const [referrer , setReferrer] = useState('');
    const [updateLoading , setUpdateLoading] = useState(false);
    const [image , setImage] = useState('');
    const { id } = useParams();
    const [loading , setLoading] = useState(false);

    const { user } = useSelector(state => state.auth);

    const imgRef = useRef(null);
   
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(reader.result);
        }
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const { data : { data : { doc } } } = await Axios(`/user/details/${id}`)
                setName(doc?.name);
                setUsername(doc?.username);
                setEmail(doc?.email);
                setPhone(doc?.phone);
                setAddress(doc?.address);
                setCountry(doc?.country);
                setGender(doc?.gender);
                setImage(doc?.image ? `${baseURL}/users/${doc?.image}` : DefaultProfileImage );
                setReferrer(doc?.referrer);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toastError(error);
            }
        }
        fetchUserDetails();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUpdateLoading(true);
            const updateData = { name , phone , address , country , gender};
            if(isBase64(image)){
                updateData.image = image;
            }
            const { data : { data : { doc , message } } } = await Axios.put(`/user/update/${id}` , updateData , {
                headers : {
                    Authorization : `Bearer ${user?.token}`
                }
            });
            toast.success(message);
            setName(doc?.name);
            setUsername(doc?.username);
            setEmail(doc?.email);
            setPhone(doc?.phone);
            setAddress(doc?.address);
            setCountry(doc?.country);
            setGender(doc?.gender);
            setImage(doc?.image ? `${baseURL}/users/${doc?.image}` : DefaultProfileImage );
            setReferrer(doc?.referrer);
            setUpdateLoading(false);
        } catch (error) {
            setUpdateLoading(false);
            toastError(error);
        }
    }
    
    return (
        <>
            {
                loading 
                ? 
                    <Loader />
                :
                    <div className="p-8">
                        <h2 className="text-white font-bold text-2xl pb-4">Edit User</h2>
                        <div className="bg-primary rounded-xl p-4">
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <div className="flex items-center justify-center flex-col mb-4">
                                    <div className="sm:w-[150px] w-[100px] sm:h-[150px] h-[100px]">
                                        <img
                                        src={image}
                                        alt="edit-profile" 
                                        className="w-full h-full rounded-full object-cover" 
                                        />
                                    </div>
                                    <div
                                    className="btn-gradient text-white w-fit mt-4"
                                    style={{ padding: "4px 16px", fontSize: "12px" }}
                                    onClick={() => imgRef.current.click()}
                                    >
                                        <input 
                                        type="file"
                                        onChange={handleFileChange} 
                                        ref={imgRef} 
                                        hidden />
                                        <button type="button" className="bg-white rounded-md py-2 px-12 text-black">Update Image</button>
                                    </div>
                                </div> 
                                <div className="flex items-center gap-4 sm:flex-row flex-col text-white">
                                    <Input
                                    label="Name"
                                    placeholder="Edit your name"
                                    value={name}
                                    setValue={setName}
                                    />
                                    <Input
                                    label="Username"
                                    placeholder="username"
                                    value={username}
                                    title="cannott edit username"
                                    readonly
                                    />
                                </div>
                                <div className="flex items-center gap-4 sm:flex-row flex-col text-white">
                                    <Input
                                    label="Email"
                                    placeholder=""
                                    value={email}
                                    title='Cannot edit email'
                                    readonly
                                    />
                                    <Input
                                    label="Phone"
                                    placeholder=""
                                    value={phone}
                                    setValue={setPhone}
                                    />
                                </div>
                                <div className="flex items-center gap-4 sm:flex-row flex-col text-white">
                                    <div className="flex flex-col gap-2 flex-1 w-full">
                                        <label className="font-semibold">Gender</label>
                                        <select 
                                        className="input"
                                        value={gender}
                                        onChange={e => setGender(e.target.value)}
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <Input
                                    label="Address"
                                    placeholder="Edit your address"
                                    value={address}
                                    setValue={setAddress}
                                    />
                                </div>
                                <div className="flex items-center gap-4 sm:flex-row flex-col text-white">
                                    <Input
                                    label="Country"
                                    placeholder="Edit your Country"
                                    value={country}
                                    setValue={setCountry}
                                    />
                                    <Input
                                    label="Sponser"
                                    placeholder=""
                                    value={referrer || '//'}
                                    readonly
                                    />
                                </div>
                                <div className="mt-4">
                                    <button 
                                    type="submit" 
                                    className="bg-white text-black py-2 px-12 rounded-md disabled:cursor-not-allowed"
                                    disabled={updateLoading}
                                    >
                                        {
                                            updateLoading 
                                            ? 
                                                <ClipLoader size={20} color='black' />
                                            : 
                                                'Save'
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
            }
        </>
    );
};

export default EditUser;