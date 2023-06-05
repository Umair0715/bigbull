import FileUploadsvg from '../../assets/svgs/FileUploadsvg';
import { useRef } from 'react';


const FileInput = ({ label , value , setValue , disable }) => {
    const imgRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setValue(reader.result);
        }
    }

    return (
        <div className='text-white'>
            <div className='flex-1 flex flex-col gap-2 text-white'>
                <label className='text-grayText font-semibold'>
                    {label}
                </label>
                <input 
                type="file" 
                ref={imgRef}
                onChange={handleFileChange}
                hidden
                />
                {
                    !disable && 
                    <div className='flex items-center justify-between border px-3 rounded-md cursor-pointer'
                    onClick={() => (
                        imgRef?.current?.click()
                    )}
                    > 
                        <div>Choose File</div>
                        <div className='py-3 px-6 border-l'>Browse</div>
                    </div>
                }
            </div>
            {
                value
                ? 
                <div 
                className='mt-4 rounded-md w-full' 
                >
                    <img 
                    src={value} 
                    alt="" 
                    className='w-[200px] h-[200px] object-cover rounded-md' 
                    />
                </div>
                :
                <div
                className="bg-[#D9D9D9] rounded-xl flex items-center justify-center py-6 mt-2"
                >
                    <FileUploadsvg />
                </div>
            }
        </div>
    )
}

export default FileInput