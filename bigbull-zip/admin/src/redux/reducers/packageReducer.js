import { createSlice } from "@reduxjs/toolkit";


const packagesSlice = createSlice({
    name : 'package',
    initialState : {
        packages : [] ,
        loading : false ,
        createLoading : false ,
        updateLoading : false 
    } ,
    reducers : {
        setPackages (state , action) {
            state.packages = action.payload;
        } ,
        setLoading (state , action) {
            state.loading = action.payload;
        } , 
        addNewPackage (state , action){
            state.packages.unshift(action.payload)
        } , 
        updatePackge (state , action) {
            const index = state.packages.findIndex(i => i._id === action.payload._id);
            state.packages[index] = action.payload;
        } ,
        removePackage (state , action) {
            state.packages = state.packages.filter(p => p._id !== action.payload);
        } ,
        setCreateLoading(state , action){
            state.createLoading = action.payload;
        } ,
        setUpdateLoading(state , action){
            state.updateLoading = action.payload;
        }
    }
});


export const { setPackages , setLoading , addNewPackage , updatePackge , setCreateLoading , setUpdateLoading , removePackage  } = packagesSlice.actions;
export default packagesSlice.reducer;