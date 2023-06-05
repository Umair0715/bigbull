const AchievedRank = require('../models/achievedRanksModel');
const Rank = require('../models/ranksModel');
const User = require('../models/userModel');

const rankAchiever = async () => {
    const users = await User.find();
    for (let user of users) {
        const directMembers = await User.find({ referrer : user.referralCode }).limit(100);

        const linesWithTotalSales = await Promise.all(directMembers.map(async (directMember , i) => {
            const line = { user: directMember , totalSale: directMember?.activePackage?.depositAmount || 0 , line : i + 1 };
            const teamMembers = await User.find({ referrer : directMember.referralCode });
            if (teamMembers.length > 0) {
                line.totalSale = teamMembers.reduce((acc, member) => {
                    if(member.activePackage){
                        return acc + member.activePackage.depositAmount
                    }else {
                        return acc 
                    }
                }, line.totalSale);
                line.totalSale += await calculateTotalSales(teamMembers, 2);
            }
            return line;
        }));

        const ranks = await Rank.find();
        for(let rank of ranks){
            let numLinesReachedRank  = 0;
            for(let i = 0 ; i < linesWithTotalSales.length ; i++){
                if(linesWithTotalSales[i].totalSale >= rank.achieveAmount){
                    numLinesReachedRank++;
                }
            }
            console.log({numLinesReachedRank})
            if(numLinesReachedRank >= 3){
                const isAchievedRank = await AchievedRank.findOne({ 
                    rank : rank._id ,
                    user : user._id ,
                })
                if(isAchievedRank) {
                    break;
                }
                const achievedRank = new AchievedRank({
                    user: user._id,
                    rank: rank._id,
                    rankName : rank.name ,
                });
                console.log({ user : user.username , achievedRank })
                await achievedRank.save();
            }
        }
    }
}


async function calculateTotalSales(members, level) {
    if (level > 100) return 0;
    const levelMembers = await User.find({ referrer: { $in: members.map((m) => m.referralCode) } });
    if (levelMembers.length === 0) return 0;
    const totalSale = levelMembers.reduce((acc, member) => {
        if(member.activePackage){
            return acc + member.activePackage.depositAmount
        }else {
            return acc  
        }
    }, 0);
    return totalSale + await calculateTotalSales(levelMembers, level + 1);
}

module.exports = rankAchiever;











