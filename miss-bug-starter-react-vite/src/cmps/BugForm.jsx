import { useState, useEffect } from 'react'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugForm } from '../cmps/BugForm.jsx'

export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [editingBug, setEditingBug] = useState(null)

    useEffect(() => {
        loadBugs()
    }, [])

    async function loadBugs() {
        const bugsFromService = await bugService.query()
        setBugs(bugsFromService)
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

    async function onSaveBug(bug) {
        try {
            const savedBug = await bugService.save(bug)
            setBugs(prevBugs => {
                const idx = prevBugs.findIndex(b => b._id === savedBug._id)
                if (idx > -1) {
                    const copy = [...prevBugs]
                    copy[idx] = savedBug
                    return copy
                }
                return [...prevBugs, savedBug]
            })
            setEditingBug(null)
            showSuccessMsg('Bug saved')
        } catch (err) {
            showErrorMsg('Cannot save bug')
        }
    }

    return (
        <main className="main-layout">
            <h3>Bugs App</h3>

            {editingBug ? (
                <BugForm
                    initialBug={editingBug}
                    onSave={onSaveBug}
                    onCancel={() => setEditingBug(null)}
                />
            ) : (
                <>
                    <button onClick={() => setEditingBug({})}>Add Bug ⛐</button>
                    <BugList
                        bugs={bugs}
                        onRemoveBug={onRemoveBug}
                        onEditBug={bug => setEditingBug(bug)}
                    />
                </>
            )}
        </main>
    )
}

