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
const https = require('https');
const http = require('http');
const fs = require('fs');




const cron = require('node-cron');
const rankAchiever = require('./croneJobs/rankAchiever');


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
app.use('/api/chat' , require('./routes/chatRoutes'));
app.use('/api/message' , require('./routes/messageRoutes'));
app.use('/api/deposit-request' , require('./routes/depositRoutes'));

app.use(require('./middlewares/errorHandler'));

// const options = {
//   key: fs.readFileSync('bigbullworld.key', 'utf8').trim(),
//   cert: fs.readFileSync('bigbullworld.crt', 'utf8').trim()
// };

// const httpServer = https.createServer(options, app);
const httpServer = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(httpServer , {
  cors : {
      origin : ['http://127.0.0.1:5173' , 'http://127.0.0.1:5174' , 'http://localhost:5173' , 'http://localhost:5174' , 'https://sg2plm.bigbullworld.com/' , 'https://bigbullworld.com']
  }
});

let chats = [];

const addToChats = (chat) => {
  if(!chats.find(ch => ch._id === chat._id)){
      chats.push(chat);
  }
}

const removeFromChats = (chat) => {
  chats = chats.filter(ch => ch._id !== chat._id );
  console.log({ all : chats })
}

io.on('connection' , (socket) => {
  console.log('someone connected' , socket.id);

  socket.on('join-chat' , (chat) => {
      addToChats(chat);
      socket.join(chat._id)
  });
  
  socket.on('new-message' , (message) => {
      socket.broadcast.to(message.chat._id).emit('new-message-recieved' , message);
  });

  socket.on('start-typing' , (roomId) => {
      socket.broadcast.to(roomId).emit('start-typing')
  });
  
  socket.on('stop-typing' , (roomId) => {
      socket.broadcast.to(roomId).emit('stop-typing')
  });

  socket.on('leave-chat' , (chat) => {
      removeFromChats(chat);
  })
})

const PORT = process.env.PORT || 3300;
httpServer.listen(PORT , () => console.log(`server is listening on port ${PORT}`))