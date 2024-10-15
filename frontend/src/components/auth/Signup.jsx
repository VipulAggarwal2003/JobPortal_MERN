import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2,Eye,EyeOff} from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();    //formdata object
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
            });
            if (res.data.success) {
        
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "user Registration Failed");
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div className='bg-[#A0D2EB] overflow-hidden'>
            <Navbar login/>
            <div className='flex items-center overflow-hidden justify-center max-w-5xl   mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 overflow-hidden bg-[#cae7f5] border border-black rounded-md p-4 my-10'>
                    <h1 className='flex justify-center   font-bold text-2xl mb-4'>Sign Up</h1>
                    <div className='my-2 '>
                        <Label>Full Name</Label>
                        <Input
                        className="border-black rounded-none"
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="vipul"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                        className="border-black rounded-none"
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="abc@gmail.com"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                        className="border-black rounded-none"
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="8080808080"
                        />
                    </div>
                    <div className='my-2 relative'>
                        <Label>Set Password</Label>
                        <Input
                        className="border-black rounded-none"
                            type={passwordVisible ? "text" : "password"}
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="shie@132"
                        />
                         <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-10"
                        >
                            {passwordVisible ? <Eye color='red'size={20} /> : <EyeOff size={20} />}  
                        </button>
                    </div>
                    <div className='items-center justify-between my-2'>
                        <Label>Profile</Label>
                    
                    <RadioGroup className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <Input
                                type="radio"
                                name="role"
                                value="jobSeeker"
                                checked={input.role === 'jobSeeker'}
                                onChange={changeEventHandler}
                                className="cursor-pointer w-4"
                            />
                            <Label htmlFor="r1">JobSeeker</Label>
                        </div>

                        <div div className="flex items-center space-x-2">
                            <Input
                                type="radio"
                                name="role"
                                value="recruiter"
                                checked={input.role === 'recruiter'}
                                onChange={changeEventHandler}
                                className="cursor-pointer w-4"
                            />
                            <Label htmlFor="r2">Recruiter</Label>
                         </div>
                    </RadioGroup>
                        </div>
                        
                        <div className='flex items-center gap-5'>
                            <Label>Profile Photo</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointe w-15 border-black rounded-none"
                            />
                        </div>
                    
                    {
                            loading ? <Button className="w-full my-4  bg-[#2ea4de] hover:bg-[#3db9f7] cursor-pointer"> <Loader2 className= ' mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className=" cursor-pointer w-full my-4  bg-[#2ea4de] hover:bg-[#3db9f7]">Create Profile</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup