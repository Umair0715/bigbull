import React from 'react'
import { Link } from 'react-router-dom'

const Otp = () => {
  return (
    <section className='h-screen  flex justify-center items-center px-10 '>
      <div className='h-[80%] lg:w-[50%] xl:w-[40%] md:w-[60%] w-full rounded-xl shadow-xl  bg-black  '>
        <header className='py-3 flex justify-center gradient-1 w-full rounded-t-lg border-b-2'>
          <img src="/images/loginlogo.svg" alt="" />
        </header>
        <div className='text-center py-6 px-6 xl:px-24  '>
          <p className='text-2xl font-semibold'>OTP Verify</p>
          <small className='text-gray-500'>You will get an OTP in admin@gmail.com</small>
        </div>
        <form className='p-5 '>
          <div className='flex justify-center gap-5 mt-5'>
            {
              [...Array(4)].map((item, index) => {
                return (
                  <span key={index} className='w-14 py-3 text-2xl border rounded-lg text-center '>{index}</span>
                )
              })
            }
          </div>
          <div className='px-20'>
            <Link to='/password'>
              <button type='submit' className='text-center gradient-3 border py-3 w-full sm:mt-10 mt-14 font-semibold rounded-lg'>
                Confirm
              </button>
            </Link>
          </div>
          <div className='mt-5 text-primary font-semibold text-center '>
            <p>02:59</p>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Otp

