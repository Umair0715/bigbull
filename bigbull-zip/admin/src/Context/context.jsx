import React, { createContext, useContext, useState } from 'react'


const AppContext = createContext()

const AppProvider = ({ children }) => {
    // Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const openSidebar  = () => setIsSidebarOpen(true)
    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false)
    const openModal = () => setIsModalOpen(true)


    return (
        <AppContext.Provider
            value={{
                isSidebarOpen,
                openSidebar , 
                setIsSidebarOpen,
                isModalOpen,
                openModal,
                setIsModalOpen,
            }}
        >{children}</AppContext.Provider>
    )
}

const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppProvider, useGlobalContext }