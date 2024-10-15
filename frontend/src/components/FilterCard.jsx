// import React, { useEffect, useState } from 'react';
// import { RadioGroup, RadioGroupItem } from './ui/radio-group';
// import { Label } from './ui/label';
// import { useDispatch } from 'react-redux';
// import { setSearchedQuery } from '@/redux/jobSlice';
// import { motion } from 'framer-motion';

// const filterData = [
//     {
//         filterType: "Location",
//         array: ["Delhi","Gurugram","Noida", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
//     },
//     {
//         filterType: "Industry",
//         array: ["Frontend Developer", "Backend Developer", "FullStack Developer","Software Developer","Cloud Engineer","DevOps Engineer"]
//     },
//     {
//         filterType: "Salary",
//         array: ["10", "20", "30", "40", "50"]
//     }
// ];

// const FilterCard = () => {
//     const [selectedValue, setSelectedValue] = useState('');
//     const [salaryRange, setSalaryRange] = useState([0, 50]); // Salary range in LPA
//     const dispatch = useDispatch();

//     const changeHandler = (value) => {
//         setSelectedValue(value);
//     };

//     // Dispatch salary range and selected filter options
//     useEffect(() => {
//         dispatch(setSearchedQuery({ selectedValue, salaryRange }));
//     }, [selectedValue, salaryRange]);

//     return (
//         <div className='w-full bg-white p-3 rounded-md'>
//             <h1 className='font-bold text-lg'>Filter Jobs</h1>
//             <hr className='mt-3' />

//             <RadioGroup value={selectedValue} onValueChange={changeHandler}>
//                 {filterData.map((data, index) => (
//                     <div key={index}>
//                         <h1 className='font-bold text-lg'>{data.filterType}</h1>
//                         {data.array.map((item, idx) => {
//                             const itemId = `id${index}-${idx}`;
//                             return (
//                                 <motion.div 
//                                     initial={{ opacity: 0, x: 100 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     exit={{ opacity: 0, x: -100 }}
//                                     transition={{ duration: 0.3 }}
//                                     key={idx} className='flex items-center space-x-2 my-2'>
//                                     <RadioGroupItem value={item} id={itemId} />
//                                     <Label htmlFor={itemId}>{item}</Label>
//                                 </motion.div>
//                             );
//                         })}
//                     </div>
//                 ))}
//             </RadioGroup>

//             {/* Salary Range Slider */}
//             <div className='my-4'>
//                 <h1 className='font-bold text-lg'>Salary Range (in LPA)</h1>
//                 <input
//                     type="range"
//                     min={0}
//                     max={50}
//                     value={salaryRange[1]} // Only adjusting the max range for simplicity
//                     onChange={(e) => setSalaryRange([0, e.target.value])}
//                     className="w-full"
//                 />
//                 <div className='flex justify-between text-sm text-gray-500'>
//                     <span>0 LPA</span>
//                     <span>{salaryRange[1]} LPA</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FilterCard;


import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { motion } from 'framer-motion'

const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Delhi","Gurugram","Noida", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer","Software Developer","Cloud Engineer","DevOps Engineer"]
    },
   // salary data comes here
]



const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedNumber,setSelectedNumber] = useState(5);
    const dispatch = useDispatch();
    
    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    const salaryChangeHandler = (e) =>{
        setSelectedNumber(e.target.value);
    }
   
    useEffect(()=>{
        dispatch(setSearchedQuery(selectedNumber));
    },[selectedNumber]);
    useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue]);
    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    fitlerData.map((data, index) => (
                        <div key = {index}>
                            <h1  className='font-bold text-lg'>{data.fitlerType}</h1>
                            {
                                data.array.map((item,idx) => {
                                    const itemId = `id${index}-${idx}`
                                    return (
                                        <motion.div 
                                        initial={{opacity:0,x:100}}
                                        animate={{opacity:1,x:0}}
                                        exit={{opacity:0,x:-100}}
                                        transition={{duration: 0.3}}
                                        key={idx}className='flex items-center space-x-2 my-2'>
                                            <RadioGroupItem value={item} id={itemId} />
                                            <Label htmlFor={itemId}>{item}</Label>
                                        </motion.div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </RadioGroup>
           <div className='mt-4'>
           <h1 className='font-bold text-lg '>Salary(in LPA)</h1>
           {/* <Slider onFocus = {true} className="mt-4 custom-slider cursor-pointer outline-none" defaultValue={[0]} max={50} step={5} onValueChange={changeHandler}/> */}
           <input
        type="range"
        className='mt-4 w-[270px] custom-slider cursor-pointer'
        max={50}
        step={5}
        value={selectedNumber}
        onChange={salaryChangeHandler}
      /> 
        <pre className='mt-3 text-xs font-semibold'>|   |   |   |   |   |   |   |   |   |   |</pre>
           <pre className=' text-xs font-semibold'>0   5  10  15  20  25  30  35  40  45  50</pre>
           </div>

        </div>
    )
}

export default FilterCard