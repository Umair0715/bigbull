import React from 'react'
import PackageForm from './PackagesForm'
import PackagesTable from './PackagesTable'

const Packages = () => {


    return (
        <section className='sm:p-10 py-10 px-4'>
            <header className='font-semibold text-xl '>
                Add New Packages
            </header>
            <PackageForm />
            <PackagesTable />
        </section>
    )
}

export default Packages
