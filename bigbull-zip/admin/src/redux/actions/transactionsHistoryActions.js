import Axios from "../../config/api";
import toastError from "../../utils/toastError";
import { setHistories  , setLoading , setCurrentPage , setPages , setDocsCount, setSelectedUser } from "../reducers/transactionsHistoryReducer";

const url = '/transaction';

export const getAllTransactionsHistory = () => async (dispatch , getState) => {
    try {
        const { currentPage } = getState().transactionsHistory;
        dispatch(setLoading(true));
        const { data : { data : { docs , pages , page , docCount , user } } } = await Axios(`${url}?page=${currentPage}` , {
            headers : {
                Authorization : `Bearer ${getState().auth.user.token}`
            }
        });
        dispatch(setSelectedUser(user));
        dispatch(setHistories(docs));
        dispatch(setCurrentPage(Number(page)));
        dispatch(setPages(pages));
        dispatch(setDocsCount(docCount));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toastError(error)
    }
}


export const getSingleUserTransactionsHistory = (id) => async (dispatch , getState) => {
    try {
        const { currentPage } = getState().transactionsHistory;
        dispatch(setLoading(true));
        const { data : { data : { docs , pages , page , docCount , user } } } = await Axios(`${url}/user/${id}?page=${currentPage}` , {
            headers : {
                Authorization : `Bearer ${getState().auth.user.token}`
            }
        });
        dispatch(setSelectedUser(user));
        dispatch(setHistories(docs));
        dispatch(setCurrentPage(Number(page)));
        dispatch(setPages(pages));
        dispatch(setDocsCount(docCount));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toastError(error)
    }
}