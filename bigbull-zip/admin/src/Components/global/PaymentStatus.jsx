import React from 'react'

const PaymentStatus = ({ status }) => {
    return (
        <div>
            <div className={`
                ${
                    status === 'pending'
                    ? 
                        'text-yellow-100 bg-yellow-500'
                    : 
                    status === 'completed'
                    ?
                        'text-green-100 bg-green-500'
                    : 
                    status === 'declined'
                    ? 
                        'text-red-100 bg-red-500'
                    : 
                        ''
            
                }
                text-sm px-2 rounded-md flex items-center gap-2 py-2 font-medium w-fit capitalize`}>
                <span>
                    {status}
                </span>
            </div>
        </div>
    )
}

export default PaymentStatus