import { setSingleCompany } from '@/redux/companySlice'
import { COMPANY_API_END_POINT} from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetCompanyById = (companyId) => {
   const dispatch = useDispatch();
    useEffect(() =>{
        const fetchSingleCompany = async() =>{
            try {
                const token = localStorage.getItem('authToken');
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`,{
                    headers:{
                        Authorization: `bearer ${token}`
                    }
                });
                if(res.data.success){
                   dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {
                console.log(error);
            }   
        }
        fetchSingleCompany();
    },[companyId,dispatch])

}

export default useGetCompanyById