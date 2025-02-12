import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import src from "../../images/Empty_profile_pic.jpg"
const Profile = () => {
    
    const { user } = useSelector(store => store.auth);
    const isResume = true;
    const [open, setOpen] = useState(false);
    const [showmessage, setShowMessage] = useState(false);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.profile?.profilePhoto != "" ? (user.profile.profilePhoto) : ({src})} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onMouseOver={() => setShowMessage(true)}
                            onMouseOut={() => setShowMessage(false)}
                            onClick={() => setOpen(true)}
                            className='relative text-right' variant="outline">
 {showmessage && (
                                <div className=' absolute top-12 bg-gray-700 text-white p-2 rounded'>
                                    Edit your profile
                                </div>
                            )}
                            <Pen />
                        </Button>
                       
                </div>
                <div className="my-5">
                    <div className="flex items-center gap-3 my-2">
                        <Mail />
                        <span>{user?.email}</span>
                    </div>

                    <div className="flex items-center gap-3 my-2">
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>

                        {
                            user?.profile?.skills.length != 0 ? user?.profile?.skills?.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>
                        }
                    </div>
                </div>
                <div className="grid w-full m-w-sm items-center gap-1.5">
                    <Label className="text-md font-bold">Resume</Label>
                    {

                        isResume ? <a className="text-blue-500 w-full hover:underline cursor-pointer" target="blank" href={user?.profile?.resume}>{user?.profile?.resumeOriginalName}</a> :
                            <span>NA</span>
                    }
                </div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile