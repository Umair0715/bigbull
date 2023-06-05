import Cookies from 'js-cookie'

const setWithdrawData = (data) => {
    if(Cookies.get('withdrawData')){
        Cookies.set('withdrawData' , JSON.stringify({...JSON.parse(Cookies.get('withdrawData')) , ...data }));
    }else{
        Cookies.set('withdrawData' , JSON.stringify({...data }));
    }
}

export default setWithdrawData;