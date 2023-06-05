import Cookies from "js-cookie";
import Axios from "../../config/api";
import { setUser , setLoading } from "../reducers/authReducer";
import { toast } from 'react-toastify';

const toastError = (err) => {
    return toast.error(err?.response?.data?.message || err?.response?.data?.data?.message || err?.message || 'something went wrong.');
}

export const register = (userData , navigate ) => async (dispatch , getState) => {
    try {
        dispatch(setLoading(true));
        const { data : { data : { doc , message } } } = await Axios.post('/admin/register' , userData);
        toast.success(message);
        localStorage.setItem('user' , JSON.stringify(doc));
        dispatch(setUser(doc));
        navigate('/')
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toastError(error);
    }
}


export const login = (loginData , navigate) => async (dispatch , getState) => {
    try {
        dispatch(setLoading(true));
        const { data : { data : { doc , message } } } = await Axios.post('/admin/login' , loginData);
        toast.success(message);
        localStorage.setItem('user' , JSON.stringify(doc));
        dispatch(setUser(doc));
        navigate('/')
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toastError(error);
    }
}


export const logout = (navigate) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        await Axios.get('/admin/logout');
        localStorage.setItem('user' , null);
        dispatch(setUser(null));
        navigate('/login');
        toast.success('Logged out successfully.')
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toastError(error);
    }
}
