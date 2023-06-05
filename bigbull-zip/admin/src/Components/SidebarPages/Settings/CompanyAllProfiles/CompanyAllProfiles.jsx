import React from 'react'
import CompanyAllProfilesForm from './CompanyAllProfilesForm'
import CompanyAllProfilesTable from './CompanyAllProfilesTable'

const CompanyAllProfiles = () => {
    return (
        <section className='p-10'>
            <header className='font-semibold text-xl '>
                Company All Profiles
            </header>
            <CompanyAllProfilesForm />
            <CompanyAllProfilesTable />
        </section>
    )
}

export default CompanyAllProfiles
