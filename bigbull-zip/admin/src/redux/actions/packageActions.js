import { toast } from "react-toastify";
import Axios from "../../config/api";
import toastError from "../../utils/toastError";
import { addNewPackage, removePackage, setCreateLoading, setLoading , setPackages, setUpdateLoading, updatePackge } from "../reducers/packageReducer"

const url = '/packages'

export const getPackages = (type = 1) => async (dispatch ) => {
    try {
        dispatch(setLoading(true));
        const { data : { data : { docs } } } = await Axios.get(`${url}?type=${type}`);
        dispatch(setPackages(docs));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toastError(error);
    }
};

export const createPackage = (packageData , setData , initState , setImage , setTags ) => async (dispatch , getState) => {
    try {
        const { token } = getState().auth.user
        dispatch(setCreateLoading(true));
        const { data : { data : { message , doc } } } = await Axios.post(url , packageData , {
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        toast.success(message);
        dispatch(addNewPackage(doc));
        setData(initState);
        setTags([]);
        setImage('');
        dispatch(setCreateLoading(false));
    } catch (error) {
        dispatch(setCreateLoading(false));
        toastError(error);
    }
}

export const _updatePackage = (packageId , updateData , navigate , type = 1) => async (dispatch , getState) => {
    try {
        const { token } = getState().auth.user
        dispatch(setUpdateLoading(true));
        const { data : { data : { message , doc } } } = await Axios.put(`${url}/${packageId}` , updateData , {
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        toast.success(message);
        dispatch(updatePackge(doc));
        navigate(type === 1 ? '/packages' : '/special-packages')
        dispatch(setUpdateLoading(false));
    } catch (error) {
        dispatch(setUpdateLoading(false));
        toastError(error);
    }
}


export const deletePackage = (packageId) => async (dispatch , getState) => {
    try {
        const { token } = getState().auth.user
        dispatch(setLoading(true));
        const { data : { data : { message } } } = await Axios.delete(`${url}/${packageId}` , {
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        toast.success(message);
        dispatch(removePackage(packageId));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setLoading(false));
        toastError(error);
    }
}