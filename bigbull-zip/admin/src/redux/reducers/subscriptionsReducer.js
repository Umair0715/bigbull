import { createSlice } from '@reduxjs/toolkit';

const subscription = createSlice({
    name : 'subscription' ,
    initialState : {
        subscriptions : [] ,
        loading : false , 
        currentPage : 1 ,
        pages : 1 , 
        docsCount : 0  
    } , 
    reducers : {
        setSubscriptions (state , action) {
            state.subscriptions = action.payload;
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

export const { setSubscriptions , setLoading , setCurrentPage , setPages , setDocsCount } = subscription.actions;
export default subscription.reducer;
