// BugIndex.jsx
import { useState, useEffect } from 'react'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'

export function BugIndex() {
  const [bugs, setBugs] = useState([])

  console.log('BugIndex rendered. Current bugs:', bugs)

  useEffect(() => {
    loadBugs()
  }, [])

  async function loadBugs() {
    const bugsFromService = await bugService.query()
    console.log('Loaded bugs from service:', bugsFromService)
    setBugs(bugsFromService)
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log('Deleted Successfully! bugId:', bugId)
      setBugs(prevBugs => {
        const newBugs = prevBugs.filter(bug => bug._id !== bugId)
        console.log('Updated bugs after removal:', newBugs)
        return newBugs
      })
      showSuccessMsg('Bug removed')
    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onAddBug() {
    const title = prompt('Bug title?')
    if (!title) return
    const severityStr = prompt('Bug severity? (number)')
    const severity = Number(severityStr)
    if (isNaN(severity)) {
      alert('Severity must be a number')
      return
    }
    try {
      const savedBug = await bugService.save({ title, severity })
      console.log('Added Bug', savedBug)
      setBugs(prevBugs => {
        const newBugs = [...prevBugs, savedBug]
        console.log('Updated bugs after addition:', newBugs)
        return newBugs
      })
      showSuccessMsg('Bug added')
    } catch (err) {
      console.log('Error from onAddBug ->', err)
      showErrorMsg('Cannot add bug')
    }
  }

  async function onEditBug(bug) {
    const severityStr = prompt('New severity? (number)', bug.severity)
    if (severityStr === null) return // Cancel pressed
    const severity = Number(severityStr)
    if (isNaN(severity)) {
      alert('Severity must be a number')
      return
    }

    const bugToSave = { ...bug, severity }
    try {
      const savedBug = await bugService.save(bugToSave)
      // If your service wraps bug in savedBug.savedBug, fix here:
      const updatedBug = savedBug.savedBug || savedBug

      console.log('Updated Bug:', updatedBug)
      setBugs(prevBugs => {
        const newBugs = prevBugs.map(currBug =>
          currBug._id === updatedBug._id ? updatedBug : currBug
        )
        console.log('Updated bugs after edit:', newBugs)
        return newBugs
      })
      showSuccessMsg('Bug updated')
    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }

  return (
    <main className="main-layout">
      <h3>Bugs App</h3>
      <main>
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
