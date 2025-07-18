import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import Login from './pages/Login'
import Register from './pages/Register'
import AddJob from './pages/AddJob'
import ManageJob from './pages/ManageJob'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'
import Profile from './pages/Profile'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/apply-jobs/:id' element={<ApplyJob/>}/>
        <Route path='/applications' element={<Applications/>}/>

            <Route path='add-job' element={<AddJob/>}/>
            <Route path='manage-job' element={<ManageJob/>}/>
            <Route path='view-application' element={<ViewApplications/>}/>

      </Routes>
    </div>
  )
}

export default App