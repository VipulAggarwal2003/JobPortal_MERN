import React from 'react'
import companiesPic from '../../images/customers-md.webp'
const CompanyHire = () => {
  return (
    <div className="flex flex-col items-center justify-center max-h-screen " >
     <img src={companiesPic} alt="" />
    <h1 className='text-xl text-black  my-10'>Top Companies hires through our portal </h1>
    </div>
  )
}

export default CompanyHire