import { useState, useEffect } from 'react'
import { bugService } from '../services/bug'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newBug, setNewBug] = useState(getEmptyBug())

  const availableLabels = [
    'critical',
    'major',
    'minor',
    'need-CR',
    'dev-branch',
    'main-branch'
  ]

  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

  useEffect(() => {
    localStorage.setItem('bugFilterBy', JSON.stringify(filterBy))
    loadBugs()
  }, [filterBy])

  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => {
      let pageIdx = undefined
      if (prevFilter.pageIdx !== undefined) pageIdx = 0
      return { ...prevFilter, ...filterBy, pageIdx }
    })
  }

  function onChangePageIdx(pageIdx) {
    // console.log('onChangePageIdx ~ pageIdx:', pageIdx)
    if (pageIdx < 0) return
    setFilterBy(prevFilter => ({ ...prevFilter, pageIdx }))
  }

  function getEmptyBug() {
    return { title: '', severity: '', description: '', labels: [] }
  }

  async function loadBugs(currentFilter = filterBy) {
    try {
      const bugsFromService = await bugService.query(currentFilter)
      let pagedBugs = bugsFromService

      setBugs(
        pagedBugs.map(bug => ({
          ...bug,
          labels: Array.isArray(bug.labels) ? bug.labels : []
        }))
      )
    } catch (err) {
      console.error('Failed to load bugs', err)
    }
  }

  function toggleModal() {
    setIsModalOpen(prev => !prev)
  }

  function handleChange({ target }) {
    const { name, value } = target
    setNewBug(prev => ({ ...prev, [name]: value }))
  }

  function handleLabelChange({ target }) {
    const selectedLabels = Array.from(target.selectedOptions, opt => opt.value)
    setNewBug(prev => ({ ...prev, labels: selectedLabels }))
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      setBugs(prev => prev.filter(bug => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      showErrorMsg('Cannot remove bug')
    }
  }

  function onEditBug(bug) {
    setNewBug({
      ...bug,
      labels: Array.isArray(bug.labels) ? bug.labels : []
    })
    toggleModal()
  }

  async function saveBug(ev) {
    ev.preventDefault()
    try {
      const bugToSave = { ...newBug, severity: Number(newBug.severity) }
      const savedBug = await bugService.save(bugToSave)

      setBugs(prev => {
        const idx = prev.findIndex(b => b._id === savedBug._id)
        if (idx > -1) {
          const copy = [...prev]
          copy[idx] = savedBug
          return copy
        }
        return [...prev, savedBug]
      })

      showSuccessMsg('Bug saved successfully!')
      setNewBug(getEmptyBug())
      toggleModal()
    } catch (err) {
      console.error(err)
      showErrorMsg('Cannot save bug')
    }
  }

  function onChangePageIdx(newPageIdx) {
    if (newPageIdx < 0) return
    setFilterBy(prev => ({ ...prev, pageIdx: newPageIdx }))
  }

  if (!bugs) return <div>Loading...</div>

  const { pageIdx, ...restOfFilter } = filterBy
  const isPaging = pageIdx !== undefined

  return (
    <section>
      {/* PAGINATION */}
      <div className="bug-pagination">
        <label> Use paging
          <input type="checkbox" checked={isPaging} onChange={() => onChangePageIdx(isPaging ? undefined : 0)} />
        </label>
        {isPaging && <>
          <button onClick={() => onChangePageIdx(pageIdx - 1)}>-</button>
          <span>{pageIdx + 1}</span>
          <button onClick={() => onChangePageIdx(pageIdx + 1)}>+</button>
        </>}
      </div>

      <button onClick={toggleModal}>Add Bug</button>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{newBug._id ? 'Edit Bug' : 'Add New Bug'}</h3>
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
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>

              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={toggleModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUG FILTER */}
      <BugFilter filterBy={filterBy} onSetFilterBy={setFilterBy} availableLabels={availableLabels} />

      {/* BUG LIST */}
      <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
    </section>
  )
}



