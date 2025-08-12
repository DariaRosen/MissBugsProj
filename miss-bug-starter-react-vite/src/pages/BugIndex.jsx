import { useState, useEffect } from 'react'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newBug, setNewBug] = useState({
    title: '',
    severity: '',
    description: '',
    labels: []
  })

  const availableLabels = ['critical', 'major', 'minor', 'need-CR', 'dev-branch', 'main-branch']

  useEffect(() => {
    loadBugs()
  }, [])

  function toggleModal() {
    setIsModalOpen(prev => !prev)
  }

  function handleChange({ target }) {
    const { name, value } = target
    setNewBug(prev => ({ ...prev, [name]: value }))
  }

  function handleLabelChange({ target }) {
    const selected = Array.from(target.selectedOptions).map(opt => opt.value)
    setNewBug(prev => ({ ...prev, labels: selected }))
  }

  async function loadBugs() {
    const bugsFromService = await bugService.query()
    setBugs(bugsFromService.map(bug => ({
      ...bug,
      labels: Array.isArray(bug.labels) ? bug.labels : []
    })))
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      showErrorMsg('Cannot remove bug')
    }
  }

  async function saveBug(ev) {
    ev.preventDefault()
    try {
      const savedBug = await bugService.save({
        ...newBug,
        severity: Number(newBug.severity)
      })
      setBugs(prev => [...prev, savedBug])
      showSuccessMsg('Bug added successfully!')
      toggleModal()
      setNewBug({ title: '', severity: '', description: '', labels: [] })
    } catch (err) {
      console.error(err)
      showErrorMsg('Cannot add bug')
    }
  }

  return (
    <section>
      <button onClick={toggleModal}>Add Bug</button>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Add New Bug</h3>
            <form onSubmit={saveBug}>
              <input
                type="text"
                name="title"
                value={newBug.title}
                placeholder="Bug title"
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="severity"
                value={newBug.severity}
                placeholder="Severity"
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                value={newBug.description}
                placeholder="Description"
                onChange={handleChange}
              />
              <select
                name="labels"
                multiple
                value={newBug.labels}
                onChange={handleLabelChange}
              >
                {availableLabels.map(label => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>

              <button type="submit">Save</button>
              <button type="button" onClick={toggleModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
    </section>
  )
}
