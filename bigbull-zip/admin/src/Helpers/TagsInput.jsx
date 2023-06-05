import React from 'react'

const TagsInput = ({tags, setTags}) => {
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
        if (e.key !== 'Enter') return
        const value = e.target.value
        if (!value.trim()) return
        setTags([...tags, value])
        e.target.value = ''
    }
    const removeTag = (index) => {
        setTags(tags.filter((el, i) => i !== index))
    }

    return (
        <div className='card-input flex gap-2 flex-wrap'>
            <input onKeyDown={handleKeyDown} type="text" placeholder='Enter amount' className='outline-none  w-full' />
            {
                tags.map((tag, index) => {
                    return (
                        <div key={index} className='inline-flex py-1 pl-2 pr-1 rounded-full gap-2 bg-gray-400 '>
                            <p>{tag}</p>
                            <p onClick={() => removeTag(index)} className='bg-slate-800 rounded-full w-6 h-6 text-xl text-white flex items-center justify-center cursor-pointer '>&times;</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default TagsInput
