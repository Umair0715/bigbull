import React from 'react'

const Input = ({ 
    label , type = 'text' , placeholder , value = '' , setValue='' , changeHandler
}) => {
    return (
        <div className='flex flex-col gap-2 flex-1 w-full'>
            <label className='font-semibold'>
                {label}
            </label>
            <input 
            type={type}
            placeholder={placeholder}
            className='input w-full'
            value={value}
            onChange={e => setValue(e.target.value)}
            />
        </div>
    )
}

export default Input