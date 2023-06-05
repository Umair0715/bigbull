import React, { useEffect, useRef, useState } from 'react'
import TagsInput from '../../../Helpers/TagsInput'
import handleFileChange from '../../../Helpers/handleFileChange'
import { useSelector , useDispatch } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import { createPackage } from '../../../redux/actions/packageActions'

const initialState = {
    name : '' ,
    monthlyProfit : '' ,
    highProfitValue : '' ,
    levelOneProfit : '' ,
    levelTwoProfit : '' ,
    levelThreeProfit : '' ,
    levelFourProfit : '' ,
    levelFiveProfit : '' ,
    levelSixProfit : '' ,
    levelSevenProfit : '' ,
    sponserLevelOneProfit : '' ,
    sponserLevelTwoProfit : '' ,
    sponserLevelThreeProfit : '' ,
    sponserLevelFourProfit : '' ,
    sponserLevelFiveProfit : '' ,
    sponserLevelSixProfit : '' ,
    sponserLevelSevenProfit : '' ,
    bullTrackLevelOneProfit : '' ,
    bullTrackLevelTwoProfit : '' ,
    bullTrackLevelThreeProfit : '' ,
    bullTrackLevelFourProfit : '' ,
    bullTrackLevelFiveProfit : '' ,
    bullTrackLevelSixProfit : '' ,
    bullTrackLevelSevenProfit : '' ,
    maximumProfitLimit : '' ,
    packageFee : '' ,
}

const PackagesForm = () => {
    const dispatch = useDispatch();
    const [ tags, setTags ] = useState([])
    const [ image , setImage ] = useState()
    const [data , setData] = useState(initialState);
    const imgRef = useRef(null)
    
    const { createLoading } = useSelector(state => state.package)

    const selectImg = () => {
        imgRef.current.click()
    }
    const handleFileChange  = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file)   
        reader.onloadend = () => {
            setImage(reader.result)
        } 
    }

    const handleChange = (e) =>{
        const { name , value } = e.target;
        setData(prev => ({...prev , [name] : value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const packageData = {...data , image , depositRange : tags };
        dispatch(createPackage(packageData , setData , initialState , setImage , setTags ));
    }


    return (
        <div className='bg-black border rounded-xl shadow-lg my-4 sm:p-5 px-4'>
            <form onSubmit={handleSubmit}>

                {/* Profit */}
                <div className='flex items-center gap-4 md:gap-12 mt-4 md:flex-row flex-col'>
                    <div className='flex flex-col gap-2 w-full flex-1'>
                        <label htmlFor="name">Name</label>
                        <input 
                        type="text" 
                        placeholder='Package Name' 
                        className='card-input focus:border-primary ' 
                        name='name'
                        value={data?.name}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label htmlFor="profit">Monthly Profit %</label>
                        <input 
                        type="number" 
                        placeholder='7%' 
                        className='card-input focus:border-primary w-full' 
                        name='monthlyProfit'
                        value={data?.monthlyProfit}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-2 w-full flex-1 mt-4'>
                    <label htmlFor="name">Monthly High Profit</label>
                    <input 
                    type="number" 
                    placeholder='Monthly hight profit ' 
                    className='card-input focus:border-primary ' 
                    name='highProfitValue'
                    value={data?.highProfitValue}
                    onChange={handleChange}
                    />
                </div>
                {/* Levels 1-3*/}
                <div className='flex items-center gap-4 lg:gap-12 mt-4 lg:flex-row flex-col'>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>Level-1 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary' 
                        name='levelOneProfit'
                        value={data?.levelOneProfit}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>Level-2 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary' 
                        name='levelTwoProfit'
                        value={data?.levelTwoProfit}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>Level-3 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary'
                        name='levelThreeProfit'
                        value={data?.levelThreeProfit}
                        onChange={handleChange}
                        />
                    </div>

                </div>
                {/* Levels 4-6*/}
                <div className='flex items-center gap-4 lg:gap-12 mt-4 lg:flex-row flex-col'>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>Level-4 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary'
                        name='levelFourProfit'
                        value={data?.levelFourProfit}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>Level-5 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary'
                        name='levelFiveProfit'
                        value={data?.levelFiveProfit}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>Level-6 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary'
                        name='levelSixProfit'
                        value={data?.levelSixProfit}
                        onChange={handleChange} 
                        />
                    </div>
                </div>
                {/* Levels 7*/}
                <div className='flex flex-col gap-2 w-full mt-4'>
                    <label>Level-7 % </label>
                    <input 
                    type="number" 
                    placeholder='%' 
                    className='card-input focus:border-primary'
                    name='levelSevenProfit'
                    value={data?.levelSevenProfit}
                    onChange={handleChange} 
                    />
                </div>
                    

                {/* SPONSER PROFIT */}
                <div className='flex items-center gap-4 lg:gap-12 mt-4 lg:flex-row flex-col'>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>Salary Level-1 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary' 
                        name='sponserLevelOneProfit'
                        value={data?.sponserLevelOneProfit}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>Salary Level-2 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary' 
                        name='sponserLevelTwoProfit'
                        value={data?.sponserLevelTwoProfit}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>Salary Level-3 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary'
                        name='sponserLevelThreeProfit'
                        value={data?.sponserLevelThreeProfit}
                        onChange={handleChange}
                        />
                    </div>

                </div>
                <div className='flex items-center gap-4 lg:gap-12 mt-4 lg:flex-row flex-col'>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>Salary Level-4 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary' 
                        name='sponserLevelFourProfit'
                        value={data?.sponserLevelFourProfit}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>Salary Level-5 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary' 
                        name='sponserLevelFiveProfit'
                        value={data?.sponserLevelFiveProfit}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>Salary Level-6 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary'
                        name='sponserLevelSixProfit'
                        value={data?.sponserLevelSixProfit}
                        onChange={handleChange}
                        />
                    </div>

                </div>
                <div className='flex items-center gap-4 md:gap-12 mt-4 md:flex-row flex-col'>
                    <div className='flex flex-col gap-2 w-full'>
                        <label>Salary Level-7 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary'
                        name='sponserLevelSevenProfit'
                        value={data?.sponserLevelSevenProfit}
                        onChange={handleChange} 
                        />
                    </div>
                </div>
                {/* SPONSER PROFIT END */}


                {/* BULLTRACK PROFIT */}
                <div className='flex items-center gap-4 lg:gap-12 mt-4 lg:flex-row flex-col'>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>BullTrack Level-1 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary' 
                        name='bullTrackLevelOneProfit'
                        value={data?.bullTrackLevelOneProfit}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>BullTrack Level-2 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary' 
                        name='bullTrackLevelTwoProfit'
                        value={data?.bullTrackLevelTwoProfit}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>BullTrack Level-3 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary'
                        name='bullTrackLevelThreeProfit'
                        value={data?.bullTrackLevelThreeProfit}
                        onChange={handleChange}
                        />
                    </div>

                </div>
                <div className='flex items-center gap-4 lg:gap-12 mt-4 lg:flex-row flex-col'>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>BullTrack Level-4 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary' 
                        name='bullTrackLevelFourProfit'
                        value={data?.bullTrackLevelFourProfit}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>BullTrack Level-5 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary' 
                        name='bullTrackLevelFiveProfit'
                        value={data?.bullTrackLevelFiveProfit}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full flex-1 '>
                        <label>BullTrack Level-6 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary'
                        name='bullTrackLevelSixProfit'
                        value={data?.bullTrackLevelSixProfit}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='flex items-center gap-4 md:gap-12 mt-4 md:flex-row flex-col'>
                    <div className='flex flex-col gap-2 w-full'>
                        <label>BullTrack Level-7 % </label>
                        <input 
                        type="number" 
                        placeholder='%' 
                        className='card-input focus:border-primary'
                        name='bullTrackLevelSevenProfit'
                        value={data?.bullTrackLevelSevenProfit}
                        onChange={handleChange} 
                        />
                    </div>
                </div>
                {/* BULLTRACK PROFIT END */}

                <div className='flex items-center gap-4 md:gap-12 mt-4 md:flex-row flex-col'>
                    <div className='flex flex-col gap-2 w-full '>
                        <label>Maximum Profit Limit % </label>
                        <input 
                        type="text" 
                        placeholder='%' 
                        className='card-input focus:border-primary'
                        name='maximumProfitLimit'
                        value={data?.maximumProfitLimit}
                        onChange={handleChange} 
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full '>
                        <label>Package Fee</label>
                        <input 
                        type="text" 
                        placeholder='%' 
                        className='card-input focus:border-primary' 
                        name='packageFee'
                        value={data?.packageFee}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                {/* Amount */}
                <div className='flex flex-col gap-2 w-full my-4 '>
                    <p>Amount</p>
                    <TagsInput tags={tags} setTags={setTags} />
                </div>
                {/* Image */}
                <div className='flex flex-col gap-2 lg:w-2/4 sm:w-3/4 mt-4'>
                    <p>Image</p>
                    <div onClick={() => imgRef.current.click()} className='box flex bg-white  text-black justify-between items-center px-4 cursor-pointer '>
                        <span>Choose File</span>
                        <span className='border-l border-black py-3 px-5 '> Browse</span>
                    </div>
                    <div onClick={selectImg} className='mt-4 cursor-pointer'>
                        <input type="file" hidden ref={imgRef} accept='image/*'
                            onChange={handleFileChange} />
                        {
                            image
                            ?
                                <img
                                    src={image}
                                    className='w-[150px] h-auto'
                                />
                            :
                                <img src='/images/demoImg.svg' alt="" />
                        }
                    </div>
                </div>
                <div className='flex justify-end mb-6 mt-6 lg:-mt-6'>
                    <button type='submit' className='gradient-3 border text-white px-20 py-2 rounded-lg mr-10'>
                        {
                            createLoading
                            ? 
                                <ClipLoader size={20} color='white' />
                            : 
                                'Create'
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default PackagesForm
