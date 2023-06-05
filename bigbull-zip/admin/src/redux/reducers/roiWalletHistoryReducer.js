import { createSlice } from '@reduxjs/toolkit';

const roiWalletHistorySlice = createSlice({
    name : 'roiWalletHistory' ,
    initialState : {
        histories : [] ,
        loading : false , 
        currentPage : 1 ,
        pages : 1 , 
        docsCount : 0 ,
        selectedUser : ''
    } , 
    reducers : {
        setHistories (state , action) {
            state.histories = action.payload;
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
        } ,
        setSelectedUser (state , action) {
            state.selectedUser = action.payload;
        }
    }
});

export const { setHistories , setLoading , setCurrentPage , setPages , setDocsCount , setSelectedUser } = roiWalletHistorySlice.actions;
export default roiWalletHistorySlice.reducer;
