import { useState, useEffect } from 'react'
import { bugService } from '../services/bug'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newBug, setNewBug] = useState(getEmptyBug())
  const PAGE_SIZE = 3

  const availableLabels = [
    'critical',
    'major',
    'minor',
    'need-CR',
    'dev-branch',
    'main-branch'
  ]

  const [filterBy, setFilterBy] = useState(() => {
    // Load filterBy from localStorage if exists, otherwise default
    const saved = localStorage.getItem('bugFilterBy')
    return saved ? JSON.parse(saved) : { title: '', minSeverity: 0, pageIdx: undefined }
  })

  // Save filterBy to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bugFilterBy', JSON.stringify(filterBy))
    loadBugs()
  }, [filterBy])

  useEffect(() => {
    loadBugs(filterBy)
  }, [filterBy])

  function getEmptyBug() {
    return { title: '', severity: '', description: '', labels: [] }
  }

  async function loadBugs(currentFilter) {
    try {
      const bugsFromService = await bugService.query(currentFilter)
      let pagedBugs = bugsFromService

      // Only slice if paging is enabled
      if (currentFilter.pageIdx !== undefined) {
        const pageIdx = currentFilter.pageIdx
        pagedBugs = bugsFromService.slice(
          pageIdx * PAGE_SIZE,
          (pageIdx + 1) * PAGE_SIZE
        )
      }

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

  function handleFilterChange({ target }) {
    const { name, value } = target
    setFilterBy(prev => ({ ...prev, [name]: value, pageIdx: 0 }))
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
          // update existing bug
          const copy = [...prev]
          copy[idx] = savedBug
          return copy
        }
        // add new bug
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

  return (
    <section>
      {/* PAGINATION */}
      <div className="bug-pagination">
        <label>
          Use Paging:
          <input
            type="checkbox"
            checked={filterBy.pageIdx !== undefined}
            onChange={() =>
              setFilterBy(prev =>
                prev.pageIdx !== undefined
                  ? { ...prev, pageIdx: undefined }
                  : { ...prev, pageIdx: 0 }
              )
            }
          />
        </label>

        {filterBy.pageIdx !== undefined && (
          <>
            <button onClick={() => onChangePageIdx(filterBy.pageIdx - 1)} disabled={filterBy.pageIdx === 0}>-</button>
            <span> {filterBy.pageIdx + 1} </span>
            <button
              onClick={() => onChangePageIdx(filterBy.pageIdx + 1)}
              disabled={bugs.length < PAGE_SIZE}
            >
              +
            </button>
          </>
        )}
      </div>

      <button onClick={toggleModal}>Add Bug</button>

      {/* FILTERS */}
      <section className="filters">
        <input
          type="text"
          name="title"
          value={filterBy.title}
          placeholder="Filter by title"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minSeverity"
          value={filterBy.minSeverity}
          placeholder="Min severity"
          onChange={handleFilterChange}
        />
        <select
          name="labels"
          value={filterBy.labels || ''}
          onChange={handleFilterChange}
        >
          <option value="">All Labels</option>
          {availableLabels.map(label => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </section>

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

      {/* BUG LIST */}
      <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
    </section>
  )
}
