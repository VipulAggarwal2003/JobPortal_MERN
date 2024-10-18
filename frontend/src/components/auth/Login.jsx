import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast} from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import userLogo from "../../../images/user_logo_3.png";
import passwordLogo from "../../../images/password_logo.png";
const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.data.success) {
                const { token } = res.data;
                // Store the JWT token in localStorage
                localStorage.setItem('authToken', token);
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Login Failed");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);
 //bg-[#8e51f8]
    return (
        <div className='bg-[#A0D2EB] backdrop-blur-3xl bg-blend-overlay min-w-[200px] min-h-[712px]'>
            <Navbar login/>
            <div className='  mt-14 flex items-center justify-center max-w-5xl max-h-5xl mx-auto'>
                <form onSubmit={submitHandler} className='bg-[#cae7f5] w-1/2 border border-black rounded-md p-4 my-10'>
                    <h1 className=' flex justify-center font-bold text-2xl mb-4'>Login</h1>
                    
                    <div className='my-2 flex border border-black'>
                        <Label className=' bg-white w-10 h-10  mr-0'><img className='' src={userLogo}></img></Label>
                        <Input
                            className="border-l-black rounded-none focus:outline-none h-10"
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Email"
                        />
                    </div>

                    <div className=' mt-1 my-2 relative flex border border-black'>
                    <Label className='bg-[#cae7f5] mr-0'><img className = 'relative bg-[#cae7f5] w-18 h-10' src={passwordLogo}></img></Label>
                        <Input
                        className="border-l-black  focus:outline-none  rounded-none"
                            type={passwordVisible ? "text" : "password"}
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-3"
                        >
                            {passwordVisible ? <Eye color="red" size={20} /> : <EyeOff size={20} />}  
                        </button>
                    </div>

                    <div className='items-center justify-between mt-4'>
                        <Label>Choose Profile</Label>
                        {<br/>}
                        <RadioGroup className="flex items-center gap-5 my-1">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="jobSeeker"
                                    checked={input.role === 'jobSeeker'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">JobSeeker</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    
                    {loading ? (
                        <Button className="w-full my-4 bg-[#2ea4de] hover:bg-[#3db9f7]cursor-pointer">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="cursor-pointer text-lg text-white w-full my-4 bg-[#2ea4de] hover:bg-[#3db9f7]">
                            Login
                        </Button>
                    )}
                    <br />
                    <span className='text-sm'>
                        Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default Login;

// import React, { useEffect, useState } from 'react'
// import Navbar from '../shared/Navbar'
// import { Label } from '../ui/label'
// import { Input } from '../ui/input'
// import { RadioGroup } from '../ui/radio-group'
// import { Button } from '../ui/button'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { USER_API_END_POINT } from '@/utils/constant'
// import { toast, Toaster } from 'sonner'
// import { useDispatch, useSelector } from 'react-redux'
// import { setLoading,setUser} from '@/redux/authSlice'
// import { Loader2 } from 'lucide-react'
// const Login = () => {
//     const [input, setInput] = useState({
//         email: "",
//         password: "",
//         role: "",
//     });
//     const { loading,user } = useSelector(store => store.auth);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const changeEventHandler = (e) => {
//         setInput({ ...input, [e.target.name]: e.target.value });
//     }

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         try {
//             dispatch(setLoading(true));
//             const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });
//             if (res.data.success) {
//                 const {token} = res.data;
                
//                 // Store the JWT token in localStorage
//                 localStorage.setItem('authToken', token);
//                 dispatch(setUser(res.data.user));
                
//                 navigate("/");
                
//                 toast.success(res.data.message);
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error?.response?.data?.message || "Login Failed");
//         } finally {
//             dispatch(setLoading(false));
//         }
//     }
//     useEffect(()=>{
//         if(user){
//             navigate("/");
//         }
//     },[])
//     return (
//         <div>
//             <Navbar />
//             <div className='flex items-center justify-center max-w-7xl mx-auto'>
//                 <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
//                     <h1 className='font-bold text-xl mb-5'>Login</h1>
//                     <div className='my-2'>
//                         <Label>Email</Label>
//                         <Input
//                             type="email"
//                             value={input.email}
//                             name="email"
//                             onChange={changeEventHandler}
//                             placeholder="abc@gmail.com"
//                         />
//                     </div>

//                     <div className='my-2'>
//                         <Label>Password</Label>
//                         <Input
//                             type="password"
//                             value={input.password}
//                             name="password"
//                             onChange={changeEventHandler}
//                             placeholder="showift123@"
//                         />
//                     </div>
//                     <div className='flex items-center justify-between'>
//                         <RadioGroup className="flex items-center gap-4 my-5">
//                             <div className="flex items-center space-x-2">
//                                 <Input
//                                     type="radio"
//                                     name="role"
//                                     value="jobSeeker"
//                                     checked={input.role === 'jobSeeker'}
//                                     onChange={changeEventHandler}
//                                     className="cursor-pointer"
//                                 />
//                                 <Label htmlFor="r1">JobSeeker</Label>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <Input
//                                     type="radio"
//                                     name="role"
//                                     value="recruiter"
//                                     checked={input.role === 'recruiter'}
//                                     onChange={changeEventHandler}
//                                     className="cursor-pointer"
//                                 />
//                                 <Label htmlFor="r2">Recruiter</Label>
//                             </div>
//                         </RadioGroup>
//                     </div>
                    
//                     {
//                         loading ? <Button className="w-full my-4 bg-[#4097f3] hover:bg-blue-600 cursor-pointer"> <Loader2 className= ' mr-2 h-4 w-4 animate-spin' /> Please wait </Button> :
                        
                        
//                         <Button type="submit" className="cursor-pointer w-full my-4 bg-[#4097f3] hover:bg-blue-600">Login</Button>
                        
//                     }
//                     {<br/>}
//                     <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Login