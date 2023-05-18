const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./utils/db');
const calculateRoiScheduler = require('./croneJobs/calculateRoiScheduler');
const schedule = require('node-schedule');
const sendBullTrackBonus = require('./croneJobs/sendBullTrackBonus');


// schedule.scheduleJob('*/5 * * * * *', calculateRoiScheduler);
// schedule.scheduleJob('0 0 5 * * *', calculateRoiScheduler);
// schedule.scheduleJob('0 0 4 * * *', sendBullTrackBonus);
// schedule.scheduleJob('0 0 3 * * *', profitTracker);

const cron = require('node-cron');
const profitTracker = require('./croneJobs/profitTrackerScheduler');
const rankAchiever = require('./croneJobs/rankAchiever');
const generateReferralCode = require('./utils/generateReferralCode');

cron.schedule('0 6 * * 1-5', rankAchiever, {
  timezone: 'Asia/Karachi' // set the time zone explicitly
});
cron.schedule('0 5 * * 1-5', calculateRoiScheduler, {
  timezone: 'Asia/Karachi' // set the time zone explicitly
});
cron.schedule('0 4 * * 1-5', sendBullTrackBonus, {
  timezone: 'Asia/Karachi' // set the time zone explicitly
});


connectDB();

app.use(cors({ origin : '*' }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit : '10mb' }));
app.use(express.static(path.join(__dirname , 'uploads')));


app.use('/api' , require('./routes/mailRoutes'));
app.use('/api/user' , require('./routes/userRoutes'));
app.use('/api/admin' , require('./routes/adminRoutes'));
app.use('/api/admin-profit' , require('./routes/adminProfitRoutes'));
app.use('/api/packages' , require('./routes/packageRoutes'));
app.use('/api/subscription' , require('./routes/subscriptionRoutes'));
app.use('/api/transaction' , require('./routes/transactionRoutes'));
app.use('/api/settings' , require('./routes/settingsRoutes'));
app.use('/api/kyc' , require('./routes/kycRoutes'));
app.use('/api/withdraw-request' , require('./routes/withdrawRequestRoutes'));
app.use('/api/roi-wallet-history' , require('./routes/roiWalletHistoryRoutes'));
app.use('/api/team-wallet-history' , require('./routes/teamWalletHistoryRoutes'));
app.use('/api/bullTrack-wallet-history' , require('./routes/bullTrackWalletHistoryRoutes'));
app.use('/api/deposit-history' , require('./routes/depositHistoryRoutes'));
app.use('/api/payment' , require('./routes/paymentRoutes'));
app.use('/api/rank' , require('./routes/rankRoutes'));
app.use('/api/achieved-rank' , require('./routes/achievedRankRoutes'));
var randomize = require('randomatic');
const getAllNotifications = require('./utils/testPayment');

// for(let i = 1 ; i < 1005 ; i++){
//    console.log(generateReferralCode(i))
// }

// const paymentId = '5688756611'; // Replace with the actual payment ID
// getAllNotifications(paymentId)
//     .then(notifications => {
//         console.log('Notifications:', notifications);
//         // Further processing or handling of the notifications
//     })
//     .catch(error => {
//         // Handle any errors
//         console.error('Failed to retrieve notifications:', error);
//     });

app.use(require('./middlewares/errorHandler'));


const PORT = process.env.PORT || 3300;
app.listen(PORT , () => console.log(`server is listening on port ${PORT}`))