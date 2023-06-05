import React from 'react'

// Image Picker
const handleFileChange = (e, setImages) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        setImages(prev => [...prev, reader.result])
    }
}
export default handleFileChange
