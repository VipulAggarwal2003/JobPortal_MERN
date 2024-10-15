import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (

        <div onClick = {()=> navigate(`/description/${job._id}`)}className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
            <div>
                <div className='flex col-span-2'>
                <img className='w-12 h-12 mr-2 ' src={job?.company?.logo} />
                <h1 className='font-medium text-lg pt-2'>{job?.company?.companyName}</h1>
                </div>
                <p className='text-sm text-gray-500'>India</p>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title} </h1>
                <p className='text-sm text-gray-600 min-h-[50px]'>{job?.description}</p>
            </div>

            <div className='flex items-center gap-2 mt-4'>
                <Badge className={"text-blue-700 font-bold"} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={"text-[#F83002] font-bold"} variant="ghost">{job?.jobType}</Badge>
                <Badge className={"text-[#7209b7] font-bold"} variant="ghost">{job?.salary}LPA</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards