import Axios from "../../config/api";
import toastError from "../../utils/toastError";
import { setUsers  , setLoading , setCurrentPage , setPages , setDocsCount } from "../reducers/userReducer";

const url = '/user/all';

export const getAllUsers = () => async (dispatch , getState) => {
    try {
        const { currentPage } = getState().user;
        dispatch(setLoading(true));
        const { data : { data : { docs , pages , page , docCount } } } = await Axios(`${url}?page=${currentPage}` , {
            headers : {
                Authorization : `Bearer ${getState().auth.user.token}`
            }
        });
        dispatch(setUsers(docs));
        dispatch(setCurrentPage(page));
        dispatch(setPages(pages));
        dispatch(setDocsCount(docCount));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toastError(error)
    }
}
