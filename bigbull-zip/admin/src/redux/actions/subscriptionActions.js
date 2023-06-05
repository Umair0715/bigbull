import { toast } from "react-toastify";
import Axios from "../../config/api";
import toastError from "../../utils/toastError";
import { setSubscriptions  , setLoading , setCurrentPage , setPages , setDocsCount } from "../reducers/subscriptionsReducer";

const url = '/subscription';

export const getAllSubscriptions = () => async (dispatch , getState) => {
    try {
        const { currentPage } = getState().subscription;
        dispatch(setLoading(true));
        const { data : { data : { docs , pages , page , docCount } } } = await Axios(`${url}?page=${currentPage}` , {
            headers : {
                Authorization : `Bearer ${getState().auth.user.token}`
            }
        });
        dispatch(setSubscriptions(docs));
        dispatch(setCurrentPage(page));
        dispatch(setPages(pages));
        dispatch(setDocsCount(docCount));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toastError(error)
    }
}
