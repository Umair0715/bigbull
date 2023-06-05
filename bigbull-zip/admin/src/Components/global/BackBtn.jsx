import { useNavigate } from 'react-router-dom';


const BackBtn = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button 
            className="btn-primary p-sm"
            onClick={() => navigate(-1)}
            >
                Back
            </button>
        </div>
    )
}

export default BackBtn