import { useState } from 'react'

export function BugSorting({ onSetSortBy }) {
    const [sortBy, setSortBy] = useState('title')
    const [sortDir, setSortDir] = useState(1) // 1 = asc, -1 = desc

    function handleSortByChange({ target }) {
        const newSortBy = target.value
        setSortBy(newSortBy)
        onSetSortBy({ sortBy: newSortBy, sortDir })
    }

    function toggleSortDir() {
        const newSortDir = sortDir === 1 ? -1 : 1
        setSortDir(newSortDir)
        onSetSortBy({ sortBy, sortDir: newSortDir })
    }

    return (
        <div className="bug-sorting">
            <label>
                Sort by:
                <select value={sortBy} onChange={handleSortByChange}>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                </select>
            </label>

            <button onClick={toggleSortDir}>
                {sortDir === 1 ? 'Asc' : 'Desc'}
            </button>
        </div>
    )
}
