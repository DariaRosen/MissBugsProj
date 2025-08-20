
import { useEffect, useState } from 'react'
import { UserMsg } from './UserMsg'
import { NavLink } from 'react-router-dom'
import { LoginSignup } from "./LoginSignup.jsx"
import { userService } from "../services/user"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"


export function AppHeader() {
  useEffect(() => {
    // component did mount when dependancy array is empty
  }, [])

  const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())


  async function onLogin(credentials) {
    try {
      const user = await userService.login(credentials)
      setLoggedinUser(user)
    } catch (err) {
      console.log('Cannot login :', err)
      showErrorMsg(`Cannot login`)
    }
  }

  async function onSignup(credentials) {
    console.log(credentials)
    try {
      const user = await userService.signup(credentials)
      setLoggedinUser(user)
      showSuccessMsg(`Welcome ${user.fullname}`)
    } catch (err) {
      console.log('Cannot signup :', err)
      showErrorMsg(`Cannot signup`)
    }
  }

  async function onLogout() {
    try {
      await userService.logout()
      setLoggedinUser(null)
    } catch (err) {
      console.log('Cannot logout :', err)
      showErrorMsg(`Cannot logout`)
    }
  }

  return (
    <header className='app-header '>
      <div className='header-container'>
        <UserMsg />
        <section className="login-signup-container">
          {!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}

          {loggedinUser && <div className="user-preview">
            <h3>Hello {loggedinUser.fullname}</h3>
            <button onClick={onLogout}>Logout</button>
          </div>}
        </section>

        <nav className='app-nav'>
          <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
          <NavLink to="/about">About</NavLink> |
          <NavLink to="/user">Users</NavLink>
        </nav>
        <h1>Bugs are Forever</h1>
      </div>
    </header>
  )
}
