import React, { useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import { setSingleJob } from '@/redux/jobSlice'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner';
import Navbar from './shared/Navbar';

const JobDescription = () => {
    const { user } = useSelector(store => store.auth);
    const { singleJob } = useSelector(store => store.job);
    const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant == user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);

    const params = useParams();
    const jobId = params.id;

    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const token = localStorage.getItem('authToken');

            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {user}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${token}`
                }
            });

            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "User must be logged in");
        }
    }


    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`);
                if (res.data.success) {

                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant == user?._id))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch]);


    return (
        <div>

            <Navbar />
            <div className="max-w-7xl mx-auto my-10">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                        <div className='flex items-center gap-2 mt-4'>
                            <Badge className={"text-blue-700 font-bold"} variant="ghost">{singleJob?.position} positions</Badge>
                            <Badge className={"text-[#F83002] font-bold"} variant="ghost">{singleJob?.jobType}</Badge>
                            <Badge className={"text-[#7209b7] font-bold"} variant="ghost">{singleJob?.salary} LPA</Badge>
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            if (isApplied) {
                                toast.error("You already applied to this job!");
                            }
                            else if (!user) {
                                toast.error("User Not Authenticated!");
                            }
                            else {
                                applyJobHandler();
                            }
                        }}
                        className={`rounded-lg ${isApplied ? 'bg-slate-500 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#531eb1]'}`}>
                        {isApplied ? ('Already Applied') : ('Apply Now')}
                    </Button>
                </div>
                <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
                <div className='my-4'>

                    <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                    <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                    <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                    <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experience}yrs</span></h1>
                    <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                    <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                    <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1>
                </div>
            </div>
        </div>
    )
}

export default JobDescription