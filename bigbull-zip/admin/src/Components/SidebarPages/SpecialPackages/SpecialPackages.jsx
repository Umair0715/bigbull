import React from 'react'
import SpecialPackageForm from './SpecialPackagesForm'
import SpecialPackageTable from './SpecialPackageTable'

const SpecialPackages = () => {


    return (
        <section className='p-10'>
            <header className='font-semibold text-xl '>
                Add New Special Packages
            </header>
            <SpecialPackageForm />
            <SpecialPackageTable />
        </section>
    )
}

export default SpecialPackages
