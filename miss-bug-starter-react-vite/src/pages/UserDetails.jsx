import React, { useState, useEffect } from 'react'
import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug/bug.service.js"
import { userService } from "../services/user/user.service.js"
import { useNavigate } from 'react-router-dom'

export function UserDetails() {
    const [user, setUser] = useState(userService.getLoggedinUser())
    const [bugsToShow, setBugsToShow] = useState([])

    useEffect(() => {
        loadUserBugs()
    }, [])

    async function loadUserBugs() {
        if (!user) return
        try {
            // send creatorId to backend, backend returns only relevant bugs
            const userBugs = await bugService.query({ creatorId: user._id })
            console.log("AAAAAAAAAAAAAAAA",userBugs);

            setBugsToShow(userBugs)
        } catch (err) {
            console.error('Cannot load user bugs', err)
        }
    }

    if (!user) return <div>Loading user...</div>

    return (
        <section className="user-details">
            <h1>Hello {user.fullname}</h1>

            <hr />
            <p>Your bugs!</p>
            <BugList bugs={bugsToShow} />

            <hr />
        </section>
    )
}
