import React, { useRef, useState } from 'react'
import SettingsSvg from '../../../../assets/svgs/SettingsSvg'
import DownArrow from '../../../../assets/svgs/DownArrow'
import DemoImg from '../../../../assets/svgs/DemoImg'
import { Link } from 'react-router-dom'
import View from '../../../../assets/svgs/View'
import useClickOutside from '../../../../Helpers/useClickOutside'

const CompanyAllProfilesTable = () => {
  const [isView, setIsView] = useState(false)
  const [isIndex, setIsIndex] = useState(null)
  const viewRef = useRef(null)

  const viewIndex = (index) => {
      setIsIndex(index)
      setIsView(true)
  }

  useClickOutside (viewRef, () => setIsView(false))

  return (
    <div className=' mt-10'>
      <p className='text-primary font-medium mx-4 my-2 '>List</p>
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
                <th className='py-4 px-3 font-semibold text-[13px] text-left whitespace-nowrap'>IMAGE</th>
                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>NAME</th>
                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>DESCRIPTION</th>
                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>FILE TYPE</th>
                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>STATUS</th>
                <th className='py-4 px-3 font-semibold text-[13px] text-center whitespace-nowrap'>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {
                [...Array(6)].map((item, index) => {
                  return (
                    <tr key={index} className='border-b'>
                      <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4'>{index}</td>
                      <td className='text-right px-5 whitespace-nowrap text-sm font-medium py-4 '>
                        <DemoImg />
                      </td>
                      <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>Shahid Saeed</td>
                      <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>lorem ipsum text...</td>
                      <td className='text-center px-5 whitespace-nowrap text-sm font-medium py-4 '>PDF</td>
                      <td className='text-center px-5 whitespace-nowrap py-4 text-sm font-medium '>
                        <span className='border gradient-1 px-8 py-1 rounded-lg text-white'>Active</span>
                      </td>
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
  )
}

export default CompanyAllProfilesTable
