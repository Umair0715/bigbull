import React, { useRef, useState } from 'react'
import SettingsSvg from '../../../assets/svgs/SettingsSvg'
import DownArrow from '../../../assets/svgs/DownArrow'
import Check from '../../../assets/svgs/Check'
import View from '../../../assets/svgs/View'
import { Link } from 'react-router-dom'
import useClickOutside from '../../../Helpers/useClickOutside'

const SponsorHistory = () => {
  const [isView, setIsView] = useState(false)
  const [isIndex, setIsIndex] = useState(null)
  const viewRef = useRef(null)

  const viewIndex = (index) => {
    setIsIndex(index)
    setIsView(true)
  }

  useClickOutside(viewRef, () => setIsView(false))

  return (
    <section className='p-10'>
      <header className='font-semibold text-xl '>
        History
      </header>
      <div className=' mt-10'>
        <p className='text-primary font-medium mx-4 my-2 '>Sponsor History</p>
        <div className='card'>
          {/* header */}
          <div className=' p-5 py-6 flex items-center justify-end w-full '>
            <div className='border rounded-xl '>
              <input className='px-3 rounded-l-xl outline-none py-2 text-black' type="text" placeholder='Search' />
              <span className='border-l p-2 px-4 cursor-pointer'><i className="uil uil-search"></i></span>
            </div>
          </div>
          <div className='overflow-auto '>
            <table className='w-full '>
              <thead >
                <tr className='bg-black '>
                  <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>#</th>
                  <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>NAME/JOINING DATE</th>
                  <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>INVESTMENT </th>
                  <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>USER NAME </th>
                  <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>LOCATION</th>
                  <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {
                  [...Array(6)].map((item, index) => {
                    return (
                      <tr key={index} className='border-b'>
                        <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>{index}</td>
                        <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-2 '>
                          <p className='flex flex-col'>
                            <span>Shahid Saeed</span>
                            <small>22/3/2023</small>
                          </p>
                        </td>
                        <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>$ 1000</td>
                        <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>
                          <p className='flex items-center gap-2 justify-center'>
                            <span>@Shahid Saeed </span>
                            <Check />
                          </p>
                        </td>
                        <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>Multan</td>
                        <td className='text-center py-4 flex justify-center px-6 whitespace-nowrap'>
                          <p onClick={() => viewIndex(index)} className='flex items-center justify-center gap-3 rounded-lg py-1 px-2 border gradient-3 cursor-pointer relative '>
                            <SettingsSvg />
                            <DownArrow />
                            {
                              index === isIndex && isView &&
                              <Link ref={viewRef} to='' className='absolute left-1/2 -translate-x-[50%] top-full z-20'>
                                <span className='rounded-xl text-sm font-medium bg-white text-black px-4 py-4 z-30 flex items-center gap-1'>
                                  <View />
                                  <span>View</span>
                                </span>
                              </Link>
                            }
                          </p>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className='py-7 px-5 flex items-center gap-3'>
            <img src="/icons/leftangle.svg" alt="" className='w-8 cursor-pointer' />
            <div className='flex items-center gap-3'>
              <span className='py-[2px] rounded w-8 font-semibold text-center '>1</span>
              <span className='py-[2px] rounded w-8 font-semibold text-center border gradient-1 '>2</span>
            </div>
            <img src="/icons/rightangle.svg" alt="" className='w-8 cursor-pointer' />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SponsorHistory
