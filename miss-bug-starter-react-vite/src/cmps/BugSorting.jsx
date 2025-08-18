// BugSorting.jsx
import { useState, useEffect } from 'react'

export function BugSorting({ onSetSortBy, currentSort }) {
    const [sortBy, setSortBy] = useState(currentSort?.sortBy || 'title')
    const [sortDir, setSortDir] = useState(currentSort?.sortDir || 'asc') // 'asc' | 'desc'

    // keep parent in sync whenever local sort changes
    useEffect(() => {
        onSetSortBy({ sortBy, sortDir })
    }, [sortBy, sortDir])

    function handleSortByChange({ target }) {
        setSortBy(target.value)
    }

    function toggleSortDir() {
        setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
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

            <button type="button" onClick={toggleSortDir}>
                {sortDir === 'asc' ? 'Asc' : 'Desc'}
            </button>
        </div>
    )
}
