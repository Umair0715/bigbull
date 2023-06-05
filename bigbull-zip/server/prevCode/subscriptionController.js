exports.createSubscriptionByCashWallet = catchAsync(async(req , res , next) => {
    const { depositAmount , packageId } = req.body;
    const { error } = subscriptionValidation.validate(req.body);
    if(error){
        return next(new AppError(error.details[0].message , 400))
    }
    const cashWallet = await CashWallet.findOne({ user : req.user._id });
    const package = await Package.findById(packageId);
    const settings = await Setting.findOne();
    if(cashWallet.totalBallance < depositAmount ){
        return next(new AppError('You have insufficient balance in your cash wallet to deposit this amount.' , 400))
    }
    if(!package.depositRange.includes(depositAmount)){
        return next(new AppError('Invalid deposit amount. This amount is not present in this package deposit range.' , 400))
    }
    const subscriptionExist = await Subscription.findOne({
        user : req.user._id ,
        expireDate : { $gt : Date.now() } 
    });
    if(subscriptionExist){
        const isPrevSubscription = await Subscription.findOne({
            user : req.user._id ,
            expireDate : { $gt : Date.now() } , 
            package : mongoose.Types.ObjectId(packageId) ,
            depositAmount 
        });
        if(isPrevSubscription){
            return next(new AppError('You already deposited amount in this range and package.' , 400))
        }
        if(depositAmount < subscriptionExist.depositAmount ){
            return next(new AppError('You can only upgrade your subscription to up level.' , 400))
        }
        const updatedSubscription = await Subscription.findByIdAndUpdate(subscriptionExist._id , {
            package : package._id ,
            expireDate : moment().add(package.duration, 'months').toDate() ,
            depositAmount 
        } , { 
            new : true , runValidators : true 
        });
        // Update user active package
        const user = await User.findById(req.user._id)
        .populate({
            path : 'bullTrackUsers',
            populate : {
                path : 'user' ,
                populate : {
                    path : 'activePackage' ,
                }
            }
        });
        user.activePackage = updatedSubscription._id;
        const updatedBullTrackUsers = user.bullTrackUsers.filter(item => {
            if(item.user.activePackage.depositAmount >= depositAmount){
                return {
                    user : item.user._id
                }
            }
        });
        user.bullTrackUsers = updatedBullTrackUsers;
        await user.save();

        const daysAgo = moment().diff(moment(subscriptionExist.createdAt), 'days');
        if(daysAgo > 60){ // detuct complete package amount
            cashWallet.totalBallance -= depositAmount;
            await cashWallet.save();
            if(user.referrer){
                sendTeamBonus(user , depositAmount);
            }
        }else{ // minus prev subscription amount and detuct remaining amount
            cashWallet.totalBallance -= (depositAmount - subscriptionExist.depositAmount);  
            await cashWallet.save();
            if(user.referrer){
                sendTeamBonus(user , depositAmount - subscriptionExist.depositAmount)
            }
        }
        
        return sendSuccessResponse(res , 200 , {
            message : 'Subscription updated successfully.' ,
            doc : updatedSubscription
        })
    }else {
        const newSubscription = await Subscription.create({
            user : mongoose.Types.ObjectId(req.user._id),
            package : package._id ,
            expireDate : moment().add(package.duration , 'months').toDate() ,
            depositAmount 
        });
        const user = await User.findById(req.user._id);
        user.activePackage = newSubscription._id;
        await user.save();
        cashWallet.totalBallance -= depositAmount;
        await cashWallet.save();

        if(user.referrer){
            const userReferrer = await User.findOne({ referralCode : user.referrer })
            .populate({
                path : 'activePackage',
                populate : {
                    path : 'package' 
                }
            });
            if(
                userReferrer.isActive && 
                userReferrer.activePackage &&
                userReferrer.activePackage.depositAmount >= settings.bullTrackThreshold 
                && 
                depositAmount >= settings.bullTrackThreshold
            ){ //depositamount => newJoinerDepositAmount
                const userReferrerJoinedDays = moment().diff(moment(userReferrer.activePackage.createdAt), 'days');

                if(userReferrerJoinedDays <= settings.bullTrackPeriod){
                    if(userReferrer.bullTrackUsers.length === 4){
                        if(
                            userReferrer.activePackage.package.type === 1 
                            &&
                            userReferrer.bullTrackUsers.find(u => u.user.toString() !== user._id.toString())
                        ){
                            const userReferrerBullTrackWallet = await BullTrackWallet.findOne({ user : userReferrer._id });
                            const bullTrackBonus = (userReferrer.activePackage.depositAmount / 100) * settings.bullTrackBonus;
                            userReferrerBullTrackWallet.totalBallance += bullTrackBonus;
                            await userReferrerBullTrackWallet.save();
                            userReferrer.bullTrackUsers = [];
                            await userReferrer.save();
                            sendTeamBonus(user , depositAmount);
                            sendTeamBonus(userReferrer , userReferrer.activePackage.depositAmount)
                        }else{
                            sendTeamBonus(user , depositAmount)
                        }
                    }else {
                        console.log('user bullTrack count is not 4')
                        if(userReferrer.bullTrackUsers.find(u => u.user.toString() !== user._id.toString())){
                            userReferrer.bullTrackUsers.push({
                                user : user._id
                            });
                            await userReferrer.save();
                        }
                        sendTeamBonus(user , depositAmount);
                    }
                }else {
                    console.log('user is not under bullTrack period');
                    sendTeamBonus(user , depositAmount);
                }
            }else{
                sendTeamBonus(user , depositAmount)
            }

        }

        return sendSuccessResponse(res , 201 , {
            message : 'Subscription created successfully.' ,
            doc : newSubscription 
        })
    } 
});











// const addUserProfit = async (referrer , deposit , levelProfit , teamLevel , from) => {
//     if(!referrer.isActive) return;
//     const referrerProfit = (deposit / 100) * levelProfit;
//     const referrerTeamWallet = await TeamWallet.findOne({ user : referrer._id });
//     referrerTeamWallet.totalBallance += referrerProfit;
//     await referrerTeamWallet.save();
//     await createTeamWalletTransaction(referrer , referrerTeamWallet , from , referrerProfit , teamLevel )
// }

// Prev sendTeamBonus Code 
// async function sendTeamBonus(user , depositAmount) {
//     const levelOneReferrer = await getReferrer(user);

//     if(levelOneReferrer.activePackage){
//         await addUserProfit(levelOneReferrer , depositAmount , levelOneReferrer.activePackage.package.levelOneProfit , 1 , user);
      
//         //level two Referrer
//         if(!levelOneReferrer.referrer) return;
//         const levelTwoReferrer = await getReferrer(levelOneReferrer);
//         if(levelTwoReferrer.activePackage){
//             await addUserProfit(levelTwoReferrer , depositAmount , levelTwoReferrer.activePackage.package.levelTwoProfit , 2 , user )

//             //level three referrer
//             if(!levelTwoReferrer.referrer) return;
//             const levelThreeReferrer = await getReferrer(levelTwoReferrer);
//             if(levelThreeReferrer.activePackage){
//                 await addUserProfit(levelThreeReferrer , depositAmount , levelThreeReferrer.activePackage.package.levelThreeProfit , 3 , user )

//                 //Level four referrer
//                 if(!levelThreeReferrer.referrer) return;
//                 const levelFourReferrer = await getReferrer(levelThreeReferrer);
//                 if(levelFourReferrer.activePackage){
//                     await addUserProfit(levelFourReferrer , depositAmount , levelFourReferrer.activePackage.package.levelFourProfit , 4 , user )

//                     //level Five Referrer
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }else{//level five referrer not have active package package
//                         return;
//                     }
//                 }else{ // level four referrer not have active package
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }
                
//             }else { // level Three referrer not have active package
//                 if(!levelThreeReferrer.referrer) return;
//                 const levelFourReferrer = await getReferrer(levelThreeReferrer);
//                 if(levelFourReferrer.activePackage){
//                     await addUserProfit(levelFourReferrer , depositAmount , levelFourReferrer.activePackage.package.levelFourProfit , 4 , user )

//                     //level Five Referrer
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }else { //level four
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }
//             }

//         }else{//level two referrer not have active package
//             if(!levelTwoReferrer.referrer) return;
//             const levelThreeReferrer = await getReferrer(levelTwoReferrer);
//             if(levelThreeReferrer.activePackage){
//                 await addUserProfit(levelThreeReferrer , depositAmount , levelThreeReferrer.activePackage.package.levelThreeProfit , 3 , user )

//                 //Level four referrer
//                 if(!levelThreeReferrer.referrer) return;
//                 const levelFourReferrer = await getReferrer(levelThreeReferrer);
//                 if(levelFourReferrer.activePackage){
//                     await addUserProfit(levelFourReferrer , depositAmount , levelFourReferrer.activePackage.package.levelFourProfit , 4 , user )

//                     //level Five Referrer
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }else { //level four
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }
//             }else { //level three
//                 if(!levelThreeReferrer.referrer) return;
//                 const levelFourReferrer = await getReferrer(levelThreeReferrer);
//                 if(levelFourReferrer.activePackage){
//                     await addUserProfit(levelFourReferrer , depositAmount , levelFourReferrer.activePackage.package.levelFourProfit , 4 , user )

//                     //level Five Referrer
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }else { //level four
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }
//             }
//         }
//     }else{ // if levelOneReferrer not have active package
//         if(!levelOneReferrer.referrer) return;
//         const levelTwoReferrer = await getReferrer(levelOneReferrer);
//         if(levelTwoReferrer.activePackage){
//             await addUserProfit(levelTwoReferrer , depositAmount , levelTwoReferrer.activePackage.package.levelTwoProfit , 2 , user )

//             //level three referrer
//             if(!levelTwoReferrer.referrer) return;
//             const levelThreeReferrer = await getReferrer(levelTwoReferrer);
//             if(levelThreeReferrer.activePackage){
//                 await addUserProfit(levelThreeReferrer , depositAmount , levelThreeReferrer.activePackage.package.levelThreeProfit , 3 , user )

//                 //Level four referrer
//                 if(!levelThreeReferrer.referrer) return;
//                 const levelFourReferrer = await getReferrer(levelThreeReferrer);
//                 if(levelFourReferrer.activePackage){
//                     await addUserProfit(levelFourReferrer , depositAmount , levelFourReferrer.activePackage.package.levelFourProfit , 4 , user )

//                     //level Five Referrer
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }else { //level four
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }
//             }else { //level three
//                 if(!levelThreeReferrer.referrer) return;
//                 const levelFourReferrer = await getReferrer(levelThreeReferrer);
//                 if(levelFourReferrer.activePackage){
//                     await addUserProfit(levelFourReferrer , depositAmount , levelFourReferrer.activePackage.package.levelFourProfit , 4 , user )

//                     //level Five Referrer
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }else { //level four
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }
//             }
//         }else { //level two
//             if(!levelTwoReferrer.referrer) return;
//             const levelThreeReferrer = await getReferrer(levelTwoReferrer);
//             if(levelThreeReferrer.activePackage){
//                 await addUserProfit(levelThreeReferrer , depositAmount , levelThreeReferrer.activePackage.package.levelThreeProfit , 3 , user )

//                 //Level four referrer
//                 if(!levelThreeReferrer.referrer) return;
//                 const levelFourReferrer = await getReferrer(levelThreeReferrer);
//                 if(levelFourReferrer.activePackage){
//                     await addUserProfit(levelFourReferrer , depositAmount , levelFourReferrer.activePackage.package.levelFourProfit , 4 , user )

//                     //level Five Referrer
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }else { //level four
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }
//             }else { //level three
//                 if(!levelThreeReferrer.referrer) return;
//                 const levelFourReferrer = await getReferrer(levelThreeReferrer);
//                 if(levelFourReferrer.activePackage){
//                     await addUserProfit(levelFourReferrer , depositAmount , levelFourReferrer.activePackage.package.levelFourProfit , 4 , user )

//                     //level Five Referrer
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }else { //level four
//                     if(!levelFourReferrer.referrer) return;
//                     const levelFiveReferrer = await getReferrer(levelFourReferrer);
//                     if(levelFiveReferrer.activePackage){
//                         await addUserProfit(levelFiveReferrer , depositAmount , levelFiveReferrer.activePackage.package.levelFiveProfit , 5 , user )
//                         return;
//                     }
//                     return;
//                 }
//             }
//         }
//     }
// }