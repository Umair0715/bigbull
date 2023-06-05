import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import packageReducer from './reducers/packageReducer';
import withdrawReducer from './reducers/withdrawReducer';
import subscriptionsReducer from './reducers/subscriptionsReducer';
import roiWalletHistoryReducer from './reducers/roiWalletHistoryReducer';
import teamWalletHistoryReducer from './reducers/teamWalletHIstoryReducer';
import bullTrackWalletHistoryReducer from './reducers/bullTrackWalletHistoryReducer';
import transactionsHistoryReducer from './reducers/transactionsHistoryReducer';
import userReducer from './reducers/userReducer';
import packageRequestReducer from './reducers/packageRequestReducer';


const store = configureStore({
    reducer : {
        auth : authReducer ,
        package : packageReducer ,
        withdraw : withdrawReducer , 
        subscription : subscriptionsReducer ,
        roiWalletHistory : roiWalletHistoryReducer ,
        teamWalletHistory : teamWalletHistoryReducer ,
        bullTrackWalletHistory : bullTrackWalletHistoryReducer ,
        transactionsHistory : transactionsHistoryReducer ,
        user : userReducer ,
        packageRequest : packageRequestReducer
    }
});

export default store;