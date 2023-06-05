import { ClipLoader } from 'react-spinners'

const Loader = ({ h = 200 , color = '#000'}) => {
    return (
        <div className={`w-full h-[${h}px] rounded-md border flex items-center justify-center mt-8`}>
            <ClipLoader size={20} color={color} />
        </div>
    )
}

export default Loader