import {setSavedJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllSavedJobsByUser = () => {
   const dispatch = useDispatch();
   const {user} = useSelector(store => store.auth);
   const {savedJobs} = useSelector(store=>store.job);
    useEffect(() =>{
        const fetchAllSavedJobs = async() =>{
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getSavedJobs/${user?._id}`);
                if(res.data.success){
                   dispatch(setSavedJobs(res.data.savedJobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllSavedJobs();
    },[savedJobs])
   
}

export default useGetAllSavedJobsByUser