import { useEffect, useRef, useState } from "react"
import { debounce } from "../services/util.service.js"
import { utilService } from "../services/util.service.js"

export function BugFilter({ filterBy, onSetFilterBy, availableLabels }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const onSetFilterByDebounce = useRef(utilService.debounce(onSetFilterBy, 400)).current

    useEffect(() => {
        onSetFilterByDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
                value = +value || ''
                break
            default:
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    const { title, minSeverity, labels } = filterByToEdit

    return (
        <section className="bug-filter">
            <h2>Filter Bugs</h2>
            <form>
                <input
                    type="text"
                    name="title"
                    value={title}
                    placeholder="Filter by title"
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="minSeverity"
                    value={minSeverity}
                    placeholder="Min severity"
                    onChange={handleChange}
                />
                <select
                    name="labels"
                    value={labels || ''}
                    onChange={handleChange}
                >
                    <option value="">All Labels</option>
                    {availableLabels.map(label => (
                        <option key={label} value={label}>
                            {label}
                        </option>
                    ))}
                </select>
            </form>
        </section>
    )
}
