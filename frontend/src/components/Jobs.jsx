import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion'
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Jobs = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery && typeof searchedQuery === 'string') {
            const filteredJobs = allJobs.filter((job) => {
                
                if(searchedQuery.length <= 2){
                    const num = Number(job.salary);
                    if(searchedQuery >= num)
                        return job;
                } 

                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())     
            });
            //console.log(searchedQuery);
            setFilterJobs(filteredJobs);
        }
      
        else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);
    return (
        <div>
            <Navbar />
            <div className='max-w-9xl  ml-17 mt-5'>
                <div className='flex  gap-5 '>
                    <div className='w-20% mr-17'><FilterCard /></div>

                    {
                        filterJobs.length <= 0 ? <span> Job not found!</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )

                    }
                </div>

            </div>

        </div>

    )
}

export default Jobs