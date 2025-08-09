
import { useEffect } from 'react'
import {UserMsg} from './UserMsg'
import { NavLink } from 'react-router-dom'

export function AppHeader() {
  useEffect(() => {
    // component did mount when dependancy array is empty
  }, [])

  return (
    <header className='app-header '>
      <div className='header-container'>
      <UserMsg />
      <nav className='app-nav'>
        <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
        <NavLink to="/about">About</NavLink>
      </nav>
      <h1>Bugs are Forever</h1>
      </div>
    </header>
  )
}
