import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import useGetAllSavedJobsByUser from '@/hooks/useGetAllSavedJobsByUser'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import Job from './Job'

const BookmarkedJobs = () => {
  useGetAllSavedJobsByUser();
  const {savedJobs} = useSelector(store=>store.job);

  return (

    <div>
    <Navbar />
    <div className='max-w-7xl mx-auto mt-5'>
        <div className='flex gap-5'>

            {
                savedJobs?.length <= 0 ? <span> Jobs Not Saved!</span> : (
                    <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                        <div className='grid grid-cols-3 gap-4'>
                            {
                                savedJobs?.map((job) => (
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

export default BookmarkedJobs;