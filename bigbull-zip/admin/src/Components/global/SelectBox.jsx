import Select from 'react-select';

const SelectBox = ( { options , setValue , value = '' , label = '' } ) => {
    const customStyles = {
        control: (provided) => ({
            ...provided,
            padding: '4px 4px' ,
            color : 'black'
        }),
        option: provided => ({
            ...provided,
            color: 'black'
        }),
    };
    const handleChange = e => {
        setValue(e.value);      
    }

    const selectedOption = options.find(option => option.value === value);

    return (
        <div className='flex flex-col gap-2 flex-1 w-full'>
            {
                label && 
                <label className='font-semibold'>
                    {label}
                </label>
            }
            <Select
                options={options}
                className='outline-none focus:border-red-500'
                inputId='select-box-input'
                styles={customStyles}
                onChange={handleChange}
                value={selectedOption}
            />
        </div>
    );
}

export default SelectBox;