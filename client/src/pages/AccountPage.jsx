import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { Navigate, Link, useParams } from 'react-router-dom'
import axios from 'axios'

const AccountPage = () => {

  // redirect state to set redirection link after logout
  const [redirect, setRedirect] = useState(null)
  // getting information from user context
  const { user, ready, setUser } = useContext(UserContext)
  // setting subpage name my extracting through params
  let {subpage} = useParams()
  if (subpage === undefined) {
    subpage = 'profile'
  }
  // setting active link
  const linkClasses = (type = null) => {
    let classes = 'py-2 px-6'
    if(type === subpage) {
      classes += ' bg-primary text-white rounded-full'
    }
    return classes
  } 

  // if response from /profile endpoint is not ready yet display loading... 
  if(!ready) {
    return 'Loading...'
  }

  // when logout button is pushed
  const logout = async () => {
    await axios.post('/logout')
    setRedirect('/')
    setUser(null)
  }

  // if ready but null user from usercontext and redirection link is not set navigate to login
  if (ready && !user && !redirect) {
    return <Navigate to={'/login'}/>
  }

  // if redirect is set navigate to redirect
  if (redirect) {
    return <Navigate to={redirect}/>
  }


  return (
    <div>
      <nav className='w-full flex justify-center mt-8 gap-4 mb-8'>
        <Link className={linkClasses('profile')} to={'/account'}>My profile</Link>
        <Link className={linkClasses('bookings')} to={'/account/bookings'}>My bookings</Link>
        <Link className={linkClasses('places')} to={'/account/places'}>My accommodations</Link>
      </nav>

      {subpage === 'profile' && (
        <div className='text-center max-w-lg mx-auto'>
          Logged in as {user.name} ({user.email}) <br />
          <button onClick={logout} className='primary max-w-sm mt-2'>Logout</button>
        </div>
      )}
    </div>
  )
}

export default AccountPage