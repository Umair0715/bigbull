import React, { useEffect, useState } from 'react'
import Input from '../../../Components/global/Input'
import FileInput from '../../../Components/global/FileInput';
import Axios, { baseURL } from '../../../config/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import toastError from '../../../utils/toastError';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import isBase64 from '../../../utils/isBase64';

const EditRank = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const [name , setName] = useState('');
    const [image , setImage] = useState('');
    const [description , setDescription] = useState('');
    const [achieveAmount , setAchieveAmount] = useState(0);
    const [loading , setLoading] = useState(false);
    const [updateLoading , setUpdateLoading] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        const fetchRank = async () =>{
            try {
                setLoading(true);
                const { data : { data : { doc } } } = await Axios(`/rank/${id}`);
                setName(doc?.name);
                setImage(`${baseURL}/ranks/${doc?.image}`);
                setDescription(doc?.description);
                setAchieveAmount(doc?.achieveAmount);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toastError(error)
            }
        }
        fetchRank();
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUpdateLoading(true);
            const rankData = { name , description , achieveAmount };
            if(isBase64(image)){
                rankData.image = image;
            }
            const { data : { data : { message } } } = await Axios.put(`/rank/${id}` , rankData , {
                headers : {
                    Authorization : `Bearer ${user?.token}`
                }
            });
            toast.success(message);
            navigate('/ranks');
            setUpdateLoading(false);
        } catch (error) {
            setUpdateLoading(false);
            toastError(error);
        }
    }

    return (
        <section className='p-10'>
            <div className='font-semibold text-2xl '>
                <h1>Create Rank</h1>
            </div>
            <div className='mt-8 bg-black p-4 border-2 border-white rounded-lg'>
                <form 
                className='flex flex-col gap-4'
                onSubmit={handleSubmit}
                >
                    <div className='flex-input'>
                        <Input
                        label='Name'
                        placeholder='Enter rank name'
                        value={name}
                        setValue={setName}
                        />
                        <Input
                        label='Achieve Amount'
                        placeholder='Enter ranks achieve amount'
                        value={achieveAmount}
                        setValue={setAchieveAmount}
                        />
                    </div>
                    <div>
                        <Input
                        label='Short Description'
                        placeholder='Enter rank description'
                        value={description}
                        setValue={setDescription}
                        />
                    </div>
                    <div>
                        <FileInput
                        label='Rank Image'
                        value={image}
                        setValue={setImage}
                        />
                    </div>
                    <div className='mt-4'>
                        <button 
                        className='btn-primary'
                        type='submit'
                        disabled={updateLoading || !name || !image || !achieveAmount}
                        >
                            {
                                updateLoading 
                                ? 
                                    <ClipLoader size={20} color='white' />
                                : 
                                    'Create'
                            }
                        </button>
                    </div>

                </form>
            </div>
        </section>
    )
}

export default EditRank