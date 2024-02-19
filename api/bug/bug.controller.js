// Bug CRUDL API
import { bugService } from './bug.service.js';
import { loggerService } from '../../services/logger.service.js';

// List
export async function getBugs(req, res) {
    try {
        const filterBy = {
            title: req.query.title || '',
            severity: +req.query.severity || 0,
            labels: req.query.labels || undefined,
           // pageIdx: req.query.pageIdx || undefined,
        }
        const sortBy = {
            sortField: req.query.sortBy | '',
            sortDir: +req.query.sortDir || ''
        }
        const bugs = await bugService.query(filterBy, sortBy)
        res.send(bugs)
    } catch (err) {
        res.status(400).send(`Couldn't get bugs...`)
    }
}

// Get
export async function getBug(req, res) {
    let visitedBugs = req.cookies.visitedBugs || [];
    const { bugId } = req.params;
    try {
        if (visitedBugs.length >= 3 && !visitedBugs.includes(bugId)) {
            res.status(401).send('Wait for a bit');
            return;
        }
        if (!visitedBugs.includes(bugId)) {
            visitedBugs.push(bugId);
            res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 }); 
        }
        const bug = await bugService.getById(bugId);
        res.send(bug);
    } catch (err) {
        res.status(400).send(`Couldn't get ${bugId}`);
        loggerService.error(err + ' in get bugs');
    }
}

// Delete
export async function removeBug(req, res) {

    var { bugId } = req.params

    try {
        await bugService.remove(bugId)
        res.send(`bug ${bugId} removed`)
    } catch (err) {
        res.status(400).send(`Couldn't remove bug`)
    }
}


// // Save
export async function addBug(req, res) {
    
    const { title, severity, description, labels } = req.body
    const bugToSave = { title, severity: +severity, description, labels }
    try {
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`Couldn't save bug`)
    }
}

// update
export async function updateBug(req, res) {


    const { _id, title, severity, description } = req.body
    const bugToSave = { _id, title, severity: +severity, description }
    try {
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`Couldn't save bug`)
    }
}