import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import src from "../../images/job_portal_home_page.png" ;
const HeroSection = () => {
  
  const [query,setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchJobHandler = () =>{
     dispatch(setSearchedQuery(query));
     navigate("/browse");  
  }

  return (
    <div >
      <div className="flex flex-col absolute z-[-10] opacity-50 w-500 h-500">
      <img  src={src}/>
      </div>
    <div className='text-center'>
      <div className='flex flex-col gap-5 my-10'>
      <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font font-medium'> No. 1 Job Hunting Website</span>
      <h1 className='text-5xl font-bold'> Search, Apply & <br/>Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
      <p>JobHunt is a place where you can find your dream job in various domains, more than 5000+ jobs are available here</p>
      <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
        <input
         type="text" 
         placeholder='Search your dream jobs here'
         onChange={(e) =>setQuery(e.target.value)}
         className='outline-none border-none w-full'
        />
        <Button onClick = {searchJobHandler} className="rounded-r-full bg-[#6A38C2]">
            <Search className='w-5 h-5'/>
        </Button>
      </div>
      </div>
    </div>
    </div>
  )
  
}

export default HeroSection