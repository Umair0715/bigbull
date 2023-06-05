import { createSlice } from '@reduxjs/toolkit';

const packageRequestsSlice = createSlice({
    name : 'packageRequest' ,
    initialState : {
        requests : [] ,
        loading : false , 
        updateLoading : false ,
        currentPage : 1 ,
        pages : 1 , 
        docsCount : 0  
    } , 
    reducers : {
        setRequests (state , action) {
            state.requests = action.payload;
        } ,
        updateRequest(state , action) {
            const index = state.requests.findIndex(r => r._id === action.payload._id);
            state.requests[index] = action.payload;
        } ,
        setLoading (state , action) {
            state.loading = action.payload;
        } ,
        setUpdateLoading (state , action) {
            state.updateLoading = action.payload;
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

export const { setRequests , updateRequest , setLoading , setUpdateLoading , setCurrentPage , setPages , setDocsCount } = packageRequestsSlice.actions;
export default packageRequestsSlice.reducer;
