import { bugService } from './bug.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getBugs(req, res) {
    const { title, minSeverity, labels, pageIdx } = req.query
    const filterBy = {
        title: title || '',
        minSeverity: minSeverity ? +minSeverity : 0,
        labels: labels ? (Array.isArray(labels) ? labels : [labels]) : []
    }

    if (pageIdx) filterBy.pageIdx = +pageIdx
    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    }
    catch (err) {
        loggerService.error('Cannot get bugs:', err)
        res.status(500).send({ error: 'Failed to get bugs' })
    }
}

export async function getBug(req, res) {
    const bugId = req.params.id

    // Read visitedBugs cookie or default to empty array
    let visitedBugs = []
    try {
        if (req.cookies.visitedBugs) {
            visitedBugs = JSON.parse(req.cookies.visitedBugs)
        }
    } catch (err) {
        console.error('Failed to parse visitedBugs cookie', err)
    }

    // If bug not already visited, add it
    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
    }

    // Log for debugging
    console.log('User visited the following bugs:', visitedBugs)

    // Save updated visitedBugs cookie with 7-second lifetime
    res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7000, httpOnly: true })

    // Check if the user exceeded the limit
    if (visitedBugs.length > 3) {
        return res.status(401).send('Wait for a bit')
    }

    // Fetch and return bug
    try {
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (error) {
        loggerService.error('Error fetching bug:', error)
        res.status(400).send({ error: 'Failed to fetch bug' })
    }
}

export async function addBug(req, res) {
    try {
        let { title, severity, labels, createdAt, description } = req.body

        const bugToSave = {
            title,
            severity: +severity,
            labels: labels ? (Array.isArray(labels) ? labels : [labels]) : [],
            description: description || '',
            createdAt: createdAt ? +createdAt : Date.now()
        }
        bugToSave._id = makeId()

        console.log('New bug:', bugToSave)

        const savedBug = await bugService.save(bugToSave)
        res.send({ savedBug })
    } catch (err) {
        console.error('Error saving bug:', err)
        res.status(500).send({ err: 'Failed to save bug' })
    }
}

export async function updateBug(req, res) {
    try {
        const existingBug = await bugService.getById(req.params.id)
        const { title, severity, description, labels } = req.body
        const bugId = req.params.id
        const safeLabels = labels ? (Array.isArray(labels) ? labels : [labels]) : []

        const bugToSave = {
            ...existingBug,
            title,
            severity: +severity,
            description,
            labels: safeLabels,
            createdAt: existingBug.createdAt
        }

        const savedBug = await bugService.save(bugToSave)
        res.send({ savedBug })
    } catch (err) {
        console.error('Failed to update bug:', err)
        res.status(500).send({ err: 'Failed to update bug' })
    }
}

export async function removeBug(req, res) {
    const bugId = req.params.id
    try {
        await bugService.remove(bugId)
        res.send({ message: 'Bug removed successfully' })
    } catch (err) {
        loggerService.error('Error removing bug:', err)
        res.status(500).send({ error: 'Failed to remove bug' })
    }
}