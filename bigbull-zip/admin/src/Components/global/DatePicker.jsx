import DatePicker from "react-datepicker";


const DatePicker_ = ({ placeholder , value , setValue , label , ...props }) => {

    return (
        <div className='flex flex-col gap-2 w-full'>
            {
                label && 
                <label clclassName='font-semibold text-grayText '>
                    {label}
                </label>
            }
        <DatePicker 
        selected={value} 
        placeholderText={placeholder}
        onChange={(date) => setValue(date)} 
        {...props}
        />
        </div>
    );
}

export default DatePicker_ ;