import React from 'react'
import { Link } from 'react-router-dom'

const Password = () => {
  return (
    <section className='h-screen  flex justify-center items-center px-10 '>
      <div className='h-[80%] lg:w-[50%] xl:w-[40%] md:w-[60%] w-full rounded-xl shadow-xl  bg-black  '>
        <header className='py-3 flex justify-center gradient-1 w-full rounded-t-lg border-b-2'>
          <img src="/images/loginlogo.svg" alt="" />
        </header>
        <div className='text-center pt-6  '>
          <p className='text-2xl font-semibold'>Enter New Password</p>
        </div>
        <form className='p-5 '>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <label className='text-primary font-semibold' htmlFor="password">New Password</label>
              <input type="passowrd" className='card-input focus:border-primary' placeholder='admin@gmail.com' required />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-primary font-semibold' htmlFor="password">Re-Type Password</label>
              <input type="password" className='card-input focus:border-primary' placeholder='admin@gmail.com' required />
            </div>
          </div>
          <div className='px-20'>
            <Link to='/login'>
              <button type='submit' className='text-center gradient-3 border py-3 w-full mt-12  font-semibold rounded-lg'>
                Done
              </button>
            </Link>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Password
