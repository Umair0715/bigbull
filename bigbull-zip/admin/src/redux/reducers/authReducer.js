import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie'


const authSlice = createSlice({
    name : 'auth' ,
    initialState : {
        user : localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null ,
        loading : false ,
    },
    reducers : {
        setUser (state , action) {
            state.user = action.payload;
        } ,
        setLoading (state , action) {
            state.loading = action.payload;
        } , 
       
    }
});

export const { setUser , setLoading } = authSlice.actions;
export default authSlice.reducer;