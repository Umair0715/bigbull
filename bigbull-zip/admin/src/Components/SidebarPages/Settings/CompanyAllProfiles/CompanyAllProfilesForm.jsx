import React, { useRef } from 'react'

const CompanyAllProfilesForm = () => {
  const imgRef = useRef(null)

  const selectImg = () => {
    imgRef.current.click()
  }
  return (
    <div className='bg-black border rounded-xl shadow-lg my-4 p-5'>
      <form >
        {/* NAME */}
        <div className='flex flex-col gap-2'>
          <label htmlFor="name">Name</label>
          <input type="text" placeholder='Name ' className='card-input focus:border-primary ' />
        </div>
        {/* Profit */}
        <div className='flex flex-col items-center xl:flex-row  xl:gap-20 mt-4'>
          <div className='flex flex-col gap-2 xl:w-1/2 w-full '>
            <label htmlFor="profit">Description</label>
            <input type="text"  className='card-input focus:border-primary w-full' />
          </div>
          <div className='flex flex-col gap-2 xl:w-1/6 w-full '>
            <p>File Type</p>
            <select className='card-input focus:border-primary'>
              <option value="">PDF</option>
              <option value="">Image</option>
              <option value="">Video</option>
            </select>
          </div>
          <div className='flex flex-col gap-2 xl:w-1/6 w-full '>
            <p>Status</p>
            <select className='card-input focus:border-primary'>
              <option value="">Active</option>
              <option value="">Disabled</option>
            </select>
          </div>
        </div>
        {/* Image */}
        <div className='flex  flex-col gap-2 lg:w-2/4 sm:w-3/4 mt-4'>
          <p>Image</p>
          <div onClick={selectImg} className='box flex bg-white  text-black justify-between items-center px-4 cursor-pointer '>
            <span>Choose File</span>
            <span className='border-l border-black py-3 px-5 '> Browse</span>
          </div>
          <div onClick={selectImg} className='mt-4 cursor-pointer'>
            <input type="file" hidden ref={imgRef} />
            <img src="/images/demoImg.svg" alt="" />
          </div>
        </div>
        <div className='flex justify-end mb-6 mt-6 lg:-mt-6'>
          <button type='submit' className='gradient-3 border text-white px-20 py-2 rounded-lg mr-10'>
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default CompanyAllProfilesForm
