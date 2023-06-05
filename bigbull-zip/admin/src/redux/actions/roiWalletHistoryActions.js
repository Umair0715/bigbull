import Axios from "../../config/api";
import toastError from "../../utils/toastError";
import { setHistories  , setLoading , setCurrentPage , setPages , setDocsCount, setSelectedUser } from "../reducers/roiWalletHistoryReducer";

const url = '/roi-wallet-history';

export const getRoiWalletHistory = (date) => async (dispatch , getState) => {
    try {
        const { currentPage } = getState().roiWalletHistory;
        dispatch(setLoading(true));
        const { data : { data : { docs , pages , page , docCount , user } } } = await Axios(`${url}?page=${currentPage}&date=${date}` , {
            headers : {
                Authorization : `Bearer ${getState().auth.user.token}`
            }
        });
        dispatch(setSelectedUser(user));
        dispatch(setHistories(docs));
        dispatch(setCurrentPage(page));
        dispatch(setPages(pages));
        dispatch(setDocsCount(docCount));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toastError(error)
    }
}

export const getUserRoiWalletHistory = (id , date) => async (dispatch , getState) => {
    try {
        const { currentPage } = getState().roiWalletHistory;
        dispatch(setLoading(true));
        const { data : { data : { docs , pages , page , docCount , user } } } = await Axios(`${url}/user/${id}?page=${currentPage}&date=${date}` , {
            headers : {
                Authorization : `Bearer ${getState().auth.user.token}`
            }
        });
        dispatch(setSelectedUser(user));
        dispatch(setHistories(docs));
        dispatch(setCurrentPage(page));
        dispatch(setPages(pages));
        dispatch(setDocsCount(docCount));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toastError(error)
    }
}
