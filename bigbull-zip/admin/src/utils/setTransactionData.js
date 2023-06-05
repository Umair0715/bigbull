import Cookies from 'js-cookie'

const setTransactionData = (data) => {
    if(Cookies.get('transactionData')){
        Cookies.set('transactionData' , JSON.stringify({...JSON.parse(Cookies.get('transactionData')) , ...data }));
    }else{
        Cookies.set('transactionData' , JSON.stringify({...data }));
    }
}

export default setTransactionData;