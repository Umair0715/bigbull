import { toast } from "react-toastify";
import Axios from "../../config/api";
import toastError from "../../utils/toastError";
import { setRequests , updateRequest , setLoading , setCurrentPage , setPages ,  setUpdateLoading, setDocsCount } from "../reducers/withdrawReducer";

const url = 'withdraw-request';

export const getWithdrawRequests = () => async (dispatch , getState) => {
    try {
        const { currentPage } = getState().withdraw;
        dispatch(setLoading(true));
        const { data : { data : { docs , pages , page , docCount } } } = await Axios(`${url}?page=${currentPage}` , {
            headers : {
                Authorization : `Bearer ${getState().auth.user.token}`
            }
        });
        dispatch(setRequests(docs));
        dispatch(setCurrentPage(page));
        dispatch(setPages(pages));
        dispatch(setDocsCount(docCount));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toastError(error)
    }
}


export const updateWithdrawRequest = (requestId , requestData , setIsModalOpen) => async (dispatch , getState) => {
    try {
        dispatch(setUpdateLoading(true));
        const { data : { data : { doc , message } } } = await Axios.put(`${url}/${requestId}` , requestData , {
            headers : {
                Authorization : `Bearer ${getState().auth.user.token}`
            }
        });
        setIsModalOpen(false);
        localStorage.removeItem('selectedRequest');
        toast.success(message);
        dispatch(updateRequest(doc));
        dispatch(setUpdateLoading(false));
    } catch (error) {
        dispatch(setUpdateLoading(false));
        toastError(error)
    }
} 