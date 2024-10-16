import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import logo from "../../../images/job portal logo.jpg";
import Url from "../../../images/Empty_profile_pic.jpg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const Navbar = ({login}) => {
  
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteHandler = async ()=>{
    try {
      const res = await axios.delete(`${USER_API_END_POINT}/deleteProfile/${user?._id}`,{
        data: { role: `${user?.role}` } 
      });
      if (res.data.success) {
        localStorage.removeItem('authToken');
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Profile Deletion Failed");
    }
  }

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`);
      if (res.data.success) {
        localStorage.removeItem('authToken');
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Logout Failed");
    }
  }
  
  return (
    <div className={` ${login ? "bg-[#A0D2EB] border border-white" : "bg-white"}`}>
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div className="flex ">
          <img src={logo} className={ `${login ? "p-1 ml-14 absolute inset-0 bg-[#A0D2EB] opacity-50 w-13 mt-2 h-14" : "p-1 ml-12 mr-3 mt-2 w-13  h-14"}`}></img>
          
          <h1 className=  {`${login ? "text-2xl mt-4 ml-3 font-bold" : "text-2xl ml-0 mt-6 font-bold"}`}>
            Job<span className="text-[#F83002]">Hunt</span>
          </h1>
        </div>

        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            {
              user && user.role === "recruiter" ? (

                <>
                  <li><Link to="/admin/companies">Companies</Link></li>
                  <li><Link to="/admin/jobs">Jobs</Link></li>
                </>

              ) : (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/jobs">Jobs</Link></li>
                  {
                    user && <li><Link to="/myAppliedJobs">AppliedJobs</Link></li>
                  }
                  {
                     user && <li><Link to="/jobs/bookmarked">SavedJobs</Link></li>
                  }

                </>
              )

            }

          </ul>

          {

            !user ? (
              <div className="flex items-center gap-2">
                <Link to="/login"> <Button variant="outline">Login</Button> </Link>
                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup
                </Button></Link>
              </div>
            ) :
              (
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user.profile.profilePhoto ? (user.profile.profilePhoto) : (Url)}
                        alt="@shadcn"
                      />
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="">
                      <div className="flex gap-4 space-y-2">
                        <Avatar className="cursor-pointer">
                          <AvatarImage
                            src={user.profile.profilePhoto ? (user.profile.profilePhoto) : (Url)}
                            alt="@shadcn"
                          />
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user?.fullname}</h4>
                          <p className="text-sm text-muted-foreground"> {user?.profile?.bio}</p>
                        </div>

                      </div>

                      <div className="flex flex-col my-2 text-gray-600">

                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <User2 />
                          <Button className="hover:text-blue-500" variant="link"><Link to="/profile">View Profile</Link></Button></div>



                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <LogOut />
                          <Button className="hover:text-amber-500" onClick={logoutHandler} variant="link"><Link>Logout</Link></Button></div>
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <div className="w-5 h-5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </div>
                          <AlertDialog  >
                            <AlertDialogTrigger asChild>
                              <Button 
                               className="hover:text-red-500" variant="link"
                              >
                                Delete Profile</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent 
                               className='w-[450px] h-[250px] p-6'>
                              <AlertDialogHeader  >
                                <AlertDialogTitle>Are you sure you want to delete your Profile?</AlertDialogTitle>
                                <AlertDialogDescription className='pt-4'>
                                  {user.role == 'jobSeeker'? 
                                  (<p >* All of your information including resume,applied job,bio will be permanentally deleted!</p>):
                                  (<p>
                                    * All of your information including companies, jobs,applicants will be permanentally deleted!
                                  </p>)
                                  }
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className=' flex pb-0 justify-items-center
                  '>
                                <AlertDialogCancel className='bg-white'>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={deleteHandler} className='bg-red-500 hover:bg-red-700'>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>

                      </div>
                    </div>


                  </PopoverContent>
                </Popover>

              )

          }

        </div>
      </div>
      
    </div>
    
  );

}

export default Navbar;
