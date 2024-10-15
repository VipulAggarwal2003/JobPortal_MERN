import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        companyName: "",
        description: "",
        location: "",
        website: "",
        file: ""
    });
    
    const {singleCompany} = useSelector(store=>store.company);

    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    const changeFileHandler = (e) => {
        const logo = e.target.files?.[0];
        setInput(({ ...input, file: logo }));
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("companyName", input.companyName);
        formData.append("description", input.description);
        formData.append("location", input.location);
        formData.append("website", input.website);

        if (input.file && (input.file.type !== 'image/jpg' && input.file.type !== 'image/png' && input.file.type !== 'image/jpeg')) {
            toast.error("company logo must be an image!");
            return;
          }
             if(input.file?.size > 2*1024*1024){
            toast.error("logo size must be less than 2MB!");
            return;
          }
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `bearer ${token}`
                },
                
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies")
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Updating info Failed!");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        setInput({
            companyName:singleCompany.companyName || "",
            description:singleCompany.description || "",
            website:singleCompany.website || "",
            location : singleCompany.location || ""
        })
        
    },[singleCompany]);

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler}>
                    <div className='flex items-center gap-5 p-8'>
                        <Button onClick = {()=> navigate("/admin/companies")} variant = "outline" className='flex items-center gap-2 text-gray-500 font font-semibold'>
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className=" font-bold text-xl">Update Company's Information</h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Company Name</Label>
                            <Input
                                type="text"
                                name="companyName"
                                value={input.companyName}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div>
                            <Label>Website URL</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div>
                            <Label>Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                            />
                             <br/>
                             <pre className='text-red-500 block mb-2'>* max image size is 2MB (jpg/png/jpeg)</pre>
                        </div>

                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> :


                            <Button type="submit" className="w-full my-4">Update</Button>

                    }
                </form>
            </div>
        </div>
    )
}

export default CompanySetup