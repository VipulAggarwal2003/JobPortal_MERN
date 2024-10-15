// import React, { useState, useEffect } from 'react'
// import { Button } from './ui/button'
// import { Avatar, AvatarImage } from './ui/avatar'
// import { Badge } from './ui/badge'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { JOB_API_END_POINT } from '@/utils/constant'
// import axios from 'axios'
// import { toast } from 'sonner'
// import { setSavedJobs } from '@/redux/jobSlice'

// const Job = ({ job }) => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { user } = useSelector(store => store.auth);
//     const { savedJobs } = useSelector(store => store.job);

//     // Determine if the current job is saved by the user
//     const isInitiallySaved = savedJobs?.some(savedJob =>
//         savedJob._id === job._id && savedJob?.saved_by?.includes(user?._id)
//     );

//     // Local state to track UI change immediately after save/unsave
//     const [save, setSave] = useState(isInitiallySaved);

//     //Sync local state with Redux state on component mount
//     useEffect(() => {
//         setSave(isInitiallySaved);
//     }, [isInitiallySaved]);

//     const daysAgoFunction = (mongodbTime) => {
//         const createdAt = new Date(mongodbTime);
//         const currentTime = new Date();
//         const timeDiff = currentTime - createdAt;
//         return Math.floor(timeDiff / (24 * 60 * 60 * 1000));
//     }

//     const changeHandler = async () => {

//         if (!save) {
//             // Save job
//             try {
//                 const token = localStorage.getItem('authToken');
//                 const res = await axios.post(`${JOB_API_END_POINT}/saveJob`, 
//                     { userId: user?._id, jobId: job._id },
//                     {
//                         headers: {
//                             "Content-Type": "application/json",
//                             "Authorization": `Bearer ${token}`
//                         }
//                     }
//                 );

//                 if (res.data.success) {
//                     toast.success(res.data.message);
//                     setSave(true); // Update local state immediately
//                     // Update Redux state
//                     const updatedSavedJobs = savedJobs.map(savedJob => {
//                         if (savedJob._id === job._id) {
//                             return {
//                                 ...savedJob,
//                                 saved_by: [...savedJob.saved_by, user?._id]
//                             };
//                         }
//                         return savedJob;
//                     });
//                     dispatch(setSavedJobs(updatedSavedJobs));
//                 } else {
//                     toast.error(res.data.message);
//                 }
//             } catch (error) {
//                 toast.error("Failed to save the job.");
//             }
//         } else {
//             // Unsave job
//             try {
//                 const token = localStorage.getItem('authToken');
//                 const res = await axios.delete(`${JOB_API_END_POINT}/unsaveJob`, {
//                     data: { userId: user?._id, jobId: job._id }
//                 });

//                 if (res.data.success) {
//                     toast.success(res.data.message);
//                     setSave(false); // Update local state immediately
//                     // Update Redux state
//                     const updatedSavedJobs = savedJobs.map(savedJob => {
//                         if (savedJob._id === job._id) {
//                             return {
//                                 ...savedJob,
//                                 saved_by: savedJob.saved_by.filter(userId => userId !== user?._id)
//                             };
//                         }
//                         return savedJob;
//                     });
//                     dispatch(setSavedJobs(updatedSavedJobs));
//                 } else {
//                     toast.error(res.data.message);
//                 }
//             } catch (error) {
//                 toast.error("Failed to unsave the job.");
//             }
//         }
//     }

//     let arrayDescrip = job?.description;
//     if (arrayDescrip?.length > 120) {
//         arrayDescrip = arrayDescrip.slice(0, 120) + "...";
//     }

//     return (
//         <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
//             <div className='flex items-center justify-between'>
//                 <p className='text-sm text-gray-500'>
//                     {daysAgoFunction(job?.createdAt) == 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
//                 </p>
//             </div>

//             <div className='flex items-center gap-2 my-2'>
//                 <Button className="p-6" variant="outline" size="icon">
//                     <Avatar>
//                         <AvatarImage src={job?.company?.logo} />
//                     </Avatar>
//                 </Button>
//                 <div>
//                     <h1 className='font-medium text-lg'>{job?.company?.companyName}</h1>
//                     <p className='text-sm text-gray-500'>India</p>
//                 </div>
//             </div>

//             <div>
//                 <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
//                 <p className='text-left text-sm text-gray-600 overflow-hidden text-ellipsis min-h-[50px]'>
//                     {arrayDescrip}
//                 </p>
//             </div>

//             <div className='flex items-center gap-2 mt-4'>
//                 <Badge className={"text-blue-700 font-bold"} variant="ghost">{job?.position} positions</Badge>
//                 <Badge className={"text-[#F83002] font-bold"} variant="ghost">{job?.jobType}</Badge>
//                 <Badge className={"text-[#7209b7] font-bold"} variant="ghost">{job?.salary} LPA</Badge>
//             </div>

//             <div className='flex justify-around mt-4 mb-4'>
//                 <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
//                 <Button className={save ? "bg-[#514e4e] hover:bg-[#9f9898]" : "bg-[#7209b7] hover:bg-[#9d1ef2]"}
//                     onClick={changeHandler}>
//                     {save ? "Unsave" : "Save For Later"}
//                 </Button>
//             </div>
//         </div>
//     )
// }

// export default Job;

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { toast } from 'sonner';
import { setSavedJobs } from '@/redux/jobSlice';

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const { savedJobs } = useSelector(store => store.job);

  // Check if the current job is saved by the user
  const isSavedByUser = savedJobs?.some(savedJob => 
    savedJob._id === job._id && savedJob?.saved_by?.includes(user?._id)
  );
  const [save, setSave] = useState(isSavedByUser);
  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDiff = currentTime - createdAt;
    return Math.floor(timeDiff / (24 * 60 * 60 * 1000));
  };

  const changeHandler = async () => {
    const token = localStorage.getItem('authToken');

    if (!save) {
      // Save the job

      const res = await axios.post(`${JOB_API_END_POINT}/saveJob`, { userId: user?._id, jobId: job._id }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${token}`
        }
      });

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedSavedJobs = savedJobs.map(savedJob => {
          if (savedJob._id === job._id) {
            return {
              ...savedJob,
              saved_by: [...savedJob.saved_by, user?._id]
            };
          }
          return savedJob;
        });
        setSave(true);
        dispatch(setSavedJobs(updatedSavedJobs));
      } else {
        toast.error(res.data.message);
        setSave(false);
      }
    } else {
      // Unsave the job
      const res = await axios.delete(`${JOB_API_END_POINT}/unsaveJob`, { data: { userId: user?._id, jobId: job._id } });

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedSavedJobs = savedJobs.map(savedJob => {
          if (savedJob._id === job._id) {
            return {
              ...savedJob,
              saved_by: savedJob.saved_by.filter(userId => userId !== user?._id)
            };
          }
          return savedJob;
        });
        setSave(false);
        dispatch(setSavedJobs(updatedSavedJobs));
      } else {
        toast.error(res.data.message);
        setSave(true);
      }
    }
  };

  let arrayDescrip = job?.description;
  if (arrayDescrip?.length > 120) {
    arrayDescrip = arrayDescrip.slice(0, 120) + "...";
  }

  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>
          {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
      </div>

      <div className='flex items-center gap-2 my-2'>
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className='font-medium text-lg'>{job?.company?.companyName}</h1>
          <p className='text-sm text-gray-500'>India</p>
        </div>
      </div>

      <div>
        <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
        <p className='text-left text-sm text-gray-600 overflow-hidden text-ellipsis min-h-[50px]'>
          {arrayDescrip}
        </p>
      </div>

      <div className='flex items-center gap-2 mt-4'>
        <Badge className={"text-blue-700 font-bold"} variant="ghost">{job?.position} positions</Badge>
        <Badge className={"text-[#F83002] font-bold"} variant="ghost">{job?.jobType}</Badge>
        <Badge className={"text-[#7209b7] font-bold"} variant="ghost">{job?.salary} LPA</Badge>
      </div>

      <div className='flex justify-around mt-4 mb-4'>
        <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
        <Button className={save ? "bg-[#514e4e] hover:bg-[#9f9898]" : "bg-[#7209b7] hover:bg-[#9d1ef2]"}
                onClick={changeHandler}>
          {save ? (<div>Unsave</div>) : (<div>Save For Later</div>)}
        </Button>
      </div>
    </div>
  );
};

export default Job;

// import React, { useState } from 'react'
// import { Button } from './ui/button'
// import { Avatar, AvatarImage } from './ui/avatar'
// import { Badge } from './ui/badge'
// import { useNavigate, } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { JOB_API_END_POINT } from '@/utils/constant'
// import axios from 'axios'
// import { toast } from 'sonner'
// import {setSavedJobs, setSingleSaveJob } from '@/redux/jobSlice'
// const Job = ({ job }) => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { user } = useSelector(store => store.auth);
//     const {savedJobs} = useSelector(store=>store.job);
//     const isInitiallySaved = savedJobs?.some(job => 
//         job?.saved_by?.some(userId => userId === user?._id)
//     );
    
//     const [save, setSave] = useState(isInitiallySaved);
//     const daysAgoFunction = (mongodbTime) => {

//         const createdAt = new Date(mongodbTime);
//         const currentTime = new Date();
//         const timeDiff = currentTime - createdAt;
//         return Math.floor(timeDiff / (24 * 60 * 60 * 1000));
//     }
//     const changeHandler = async () => {

//         if (save == false) {
//             const token = localStorage.getItem('authToken');
//             const res = await axios.post(`${JOB_API_END_POINT}/saveJob`, { userId: user?._id, jobId: job._id },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `bearer ${token}`
//                     }
//                 }
//             )
//             if (res.data.success) {
//                 toast.success(res.data.message);
//                 setSave(true);
//                 const updatedSavedJobs = savedJobs.map(savedJob => {
//                     if (savedJob._id === job._id) {
//                         // Update the saved_by array for the current job
//                         return {
//                             ...savedJob,
//                             saved_by: [...savedJob.saved_by, user?._id]
//                         };
//                     }
//                     return savedJob; // Return other jobs unchanged
//                 });
//                 dispatch(setSavedJobs(updatedSavedJobs));
//             }
//             else {
//                 toast.error(res.data.message);
//             }

//         }
//         else {
//             const res = await axios.delete(`${JOB_API_END_POINT}/unsaveJob`, { data: { userId: user?._id, jobId: job._id } });
//             if (res.data.success) {
//                 toast.success(res.data.message);
//                 setSave(false);
//                 const updatedSavedJobs = savedJobs.map(savedJob => {
//                     if (savedJob._id === job._id) {
//                         // Remove the user's ID from the saved_by array for the current job
//                         return {
//                             ...savedJob,
//                             saved_by: savedJob.saved_by.filter(userId => userId !== user?._id)
//                         };
//                     }
//                     return savedJob; // Return other jobs unchanged
//                 });
//                   dispatch(setSavedJobs(updatedSavedJobs));
                  

//             }
//             else {
//                 toast.error(res.data.message);
//             }
//         }

//     }
//     let arrayDescrip = job?.description;
//     if (arrayDescrip?.length > 120) {
//         arrayDescrip = arrayDescrip.slice(0, 120) + "...";

//     }
//     return (

//         <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
//             <div className='flex items-center justify-between'>
//                 <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt)
//                     == 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
//                 {/* <Button variant="outline" className="rounded-full" size="icon"><Bookmark
//                  color='#000000' // Changes the color
//                  fill ='#000000' // Adds fill color when bookmarked
//                   // Adjust stroke for visual consistency
//                 /></Button> */}
//             </div>

//             <div className='flex items-center gap-2 my-2'>
//                 <Button className="p-6" variant="outline" size="icon">
//                     <Avatar>
//                         <AvatarImage src={job?.company?.logo} />
//                     </Avatar>
//                 </Button>
//                 <div>
//                     <h1 className='font-medium text-lg'>{job?.company?.companyName}</h1>
//                     <p className='text-sm text-gray-500'>India</p>
//                 </div>
//             </div>

//             <div>
//                 <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
//                 <p className='text-left text-sm text-gray-600 overflow-hidden text-ellipsis min-h-[50px]'>
//                     {arrayDescrip}
//                 </p>
//             </div>

//             <div className='flex items-center gap-2 mt-4'>
//                 <Badge className={"text-blue-700 font-bold"} variant="ghost">{job?.position} positions</Badge>
//                 <Badge className={"text-[#F83002] font-bold"} variant="ghost">{job?.jobType}</Badge>
//                 <Badge className={"text-[#7209b7] font-bold"} variant="ghost">{job?.salary} LPA</Badge>
//             </div>
//             <div className=' flex justify-around mt-4 mb-4'>
//                 <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
//                 <Button className={save == false ? "bg-[#7209b7] hover:bg-[#9d1ef2]" : ("bg-[#514e4e] hover:bg-[#9f9898]")}
//                     onClick={changeHandler}>
//                     {save == true ? (<div>Unsave</div>) : (<div>Save For Later</div>)}
//                 </Button>

//             </div>
//         </div>
//     )
// }

// export default Job