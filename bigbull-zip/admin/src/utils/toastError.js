import { toast } from "react-toastify";

const toastError = (err) => {
    return toast.error(err?.response?.data?.data?.message || err?.message || 'something went wrong.');
}

export default toastError;