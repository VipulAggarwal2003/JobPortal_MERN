import AppliedJobTable from "./components/AppliedJobTable";
import BookmarkedJobs from "./components/BookmarkedJobs";
import Browse from "./components/Browse";
import Home from "./components/Home";
import JobDescription from "./components/JobDescription";
import Jobs from "./components/Jobs";
import Profile from "./components/Profile";
import AdminJobs from "./components/admin/AdminJobs";
import Applicants from "./components/admin/Applicants";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import PostJob from "./components/admin/PostJob";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
 const appRouter = createBrowserRouter([
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path:'/signup',
      element:<Signup/>
    },
    {
      path:'/jobs',
      element:<Jobs/>
    },
    {
      path:'/jobs/bookmarked',
      element:<BookmarkedJobs/>
    },
    {
      path:'/description/:id',
      element:<JobDescription/>
    },
    {
      path:'/browse',
      element:<Browse/>
    },
    {
      path:'/myAppliedJobs',
      element:<AppliedJobTable/>
    },
    {
      path:'/profile',
      element:<Profile/>
    },
    // admin starts from here
    {
      path:'/admin/companies',
      element:<ProtectedRoute><Companies/></ProtectedRoute>
    },
    {
      path:'/admin/companies/create',
      element:<ProtectedRoute><CompanyCreate/></ProtectedRoute>
    },
    {
      path:'/admin/company/:id',
      element:<ProtectedRoute><CompanySetup/></ProtectedRoute>
    },
    {
      path:'/admin/jobs',
      element:<ProtectedRoute><AdminJobs/></ProtectedRoute>
    },
    {
      path:'/admin/jobs/create',
      element:<ProtectedRoute><PostJob/></ProtectedRoute>
    },
    {
      path:'/admin/jobs/:id/applicants',
      element:<ProtectedRoute><Applicants/></ProtectedRoute>
    },
 ])

  return (
    <div>
      <RouterProvider router={appRouter}/>
    </div>
  );
}

export default App;
