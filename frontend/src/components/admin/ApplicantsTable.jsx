import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    // Move state inside the component
    const [isPopOverOpen, setIsPopOverOpen] = useState(null);  // null means no popover is open

    const statusHandler = async (status, id) => {
        // Close the popover when status button is clicked
        setIsPopOverOpen(null);
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${token}`
                }
            });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {
                                        item?.applicant?.profile?.resume ?
                                            <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a>
                                            : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.applicant?.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover
                                        open={isPopOverOpen === item?._id}  // Open only for the current row
                                        onOpenChange={() => setIsPopOverOpen(isPopOverOpen === item?._id ? null : item?._id)}  // Toggle popover state
                                    >
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 bg-white">
                                            {
                                                shortlistingStatus.map((status, index) => (
                                                    <button
                                                        onClick={() => statusHandler(status, item?._id)}
                                                        key={index}
                                                        className='flex w-fit items-center my-2 cursor-pointer bg-white'>
                                                        <span className={`${status === "Rejected" ? 'border rounded border-gray-500 bg-red-400 ' : 'border rounded border-gray-500 bg-green-400'}`}>
                                                            {status == "Accepted" ? (
                                                                <div className='w-20'>ACCEPT</div>
                                                            ) : (<div className='w-20'>REJECT</div>)}

                                                        </span>
                                                    </button>
                                                ))
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </tr>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable;
