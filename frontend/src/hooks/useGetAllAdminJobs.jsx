import { setAllAdminJobs} from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminJobs = () => {
   const dispatch = useDispatch();
    useEffect(() =>{
        const fetchAllAdminJobs = async() =>{
            try {
                const token = localStorage.getItem('authToken');
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`,{
                    headers:{
                        Authorization: `bearer ${token}`
                    }
                });
                if(res.data.success){
                   dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllAdminJobs();
    },[])

}

export default useGetAllAdminJobs