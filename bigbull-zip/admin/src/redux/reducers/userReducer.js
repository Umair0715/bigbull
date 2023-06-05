import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name : 'user' ,
    initialState : {
        users : [] ,
        loading : false , 
        currentPage : 1 ,
        pages : 1 , 
        docsCount : 0  
    } , 
    reducers : {
        setUsers (state , action) {
            state.users = action.payload;
        } ,
        setLoading (state , action) {
            state.loading = action.payload;
        } ,
        setCurrentPage (state , action) {
            state.currentPage = action.payload;
        } ,
        setPages (state , action) {
            state.pages = action.payload;
        } ,
        setDocsCount (state , action) {
            state.docsCount = action.payload;
        }
    }
});

export const { setUsers , setLoading , setCurrentPage , setPages , setDocsCount } = userSlice.actions;
export default userSlice.reducer;
