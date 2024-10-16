import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { setUser } from '@/redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.map(skill => skill) || "",
    file: "",
    profilePhoto: ""
  });

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });

  }

  const changePhotoHandler = (e) => {
    const photo = e.target.files?.[0];
    setInput({ ...input, profilePhoto: photo });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file && input.file.type !== 'application/pdf') {
      toast.error("Resume must be in pdf format!")
      return;
    }
    if (input.file?.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB!");
      return;
    }
    if (input.profilePhoto && (input.profilePhoto.type !== 'image/jpg' && input.profilePhoto.type !== 'image/png' && input.profilePhoto.type !== 'image/jpeg')) {
      toast.error("Profile Photo must be an image!");
      return;
    }
    if (input.profilePhoto?.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB!");
      return;
    }

    if (input.file) {
      formData.append("file", input.file);
    }

    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `bearer ${token}`
        },
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Update Info failed");
    }
    finally {
      setLoading(false);
    }
    setOpen(false);

  }

  return (
    <div >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-[470px]" onInteractOutside={() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle className='text-center text-2xl text-black'>Update profile</DialogTitle>

            <button
              className="absolute top-1 right-1 mr-1 "
              onClick={() => setOpen(false)}
            >
              <svg xmlns="#5f5d5d" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </DialogHeader>

          <form onSubmit={submitHandler}>
            <div className='grid gap-3 py-2'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="fullname"
                  type="text"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="number" className="text-right">Phone No.</Label>
                <Input
                  id="number"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="bio" className="text-right">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="skills" className="text-right">Skills</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={input.skills}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-x-4 gap-y-0'>
                <Label htmlFor="file" className="text-right">Resume</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  onChange={changeFileHandler}
                  className="col-span-3"
                />
                <br />
                <pre className='text-red-500 block mt-1 '>* max file size is 5MB (pdf only)</pre>
              </div>

              <div className='grid grid-cols-4 items-center gap-x-4 gap-y-0'>
                <Label htmlFor="profilePhoto" className="text-right">Profile Photo</Label>
                <Input
                  type="file"
                  id="profilePhoto"
                  name="profilePhoto"
                  accept="image/*"
                  onChange={changePhotoHandler}
                  className="col-span-3 mt-1"
                /> <br />
                <pre className='text-red-500 block mt-1 '>* max image size is 2MB (jpg/png/jpeg)</pre>
              </div>
            </div>
            <DialogFooter>
              {
                loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> :
                  <Button type="submit" className="w-full my-4">Update</Button>
              }
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdateProfileDialog