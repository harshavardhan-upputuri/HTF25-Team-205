

import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import AboutPage from './Pages/About'
import Footer from './Components/Footer'
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from './Pages/Signup'
import Profile from './Pages/Citizen/Profile'
import TechnicianProfile from './Pages/Technician/TechnicianProfile'
import OfficerProfile from './Pages/Officer/OfficerProfile'
import TechnicianList from './Pages/Officer/TechnicianList'
import CreateTechnicianForm from './Pages/Officer/CreateTechnicianForm'
import OfficerDashboard from './Pages/Officer/OfficerDashboard'
import HeadDashboard from './Pages/Head/HeadDashboard'
import TechnicianIssues from './Pages/Issues/TechnicianIssues'
import CitizenIssues from './Pages/Issues/CitizenIssues'
import CitizenFetchIssue from './Pages/Issues/CitizenFecthISsue'
import OfficerIssues from './Pages/Issues/OfficerIssues'
import AllIssues from './Pages/AllIssues'
import IssueForm from './Pages/IssueForm'

function App() {


  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/citizen/profile' element={<Profile/>} />
        <Route path='/technician/profile' element={<TechnicianProfile/>} />
        <Route path='/officer/profile' element={<OfficerProfile/>} />
        <Route path='/technician-list' element={<TechnicianList/>} />
        <Route path='/create-technician' element={<CreateTechnicianForm/>} />
        <Route path='/officer-dashboard' element={<OfficerDashboard/>} />
        <Route path='/head-dashboard' element={<HeadDashboard/>} />
        <Route path='/technician-issues' element={<TechnicianIssues/>} />
        <Route path='/report-issue' element={<CitizenIssues/>} />
        <Route path='/my-issues' element={<CitizenFetchIssue/>} />

        <Route path='/all-issues' element={<OfficerIssues/>} />
        <Route path='/issues' element={<AllIssues/>}/>
    
  


        
        
      </Routes>
      {/* <IssueForm/> */}
      <Footer />
    </>
  )
}

export default App
