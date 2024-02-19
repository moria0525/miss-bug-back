import fs from 'fs'

import { loggerService } from '../../services/logger.service.js'
import { utilService } from './../../services/util.service.js';

export const bugService = {
    query,
    getById,
    remove,
    save,
}

var bugs = utilService.readJsonFile('./data/bug.json')
//const PAGE_SIZE = 12

async function query(filterBy= {}, sortBy ={}) {
        try {
            let bugToReturn = [...bugs];
    
            // Apply text filter if provided
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i');
                bugToReturn = bugToReturn.filter(bug => regExp.test(bug.title));
            }
    
            // Apply severity filter if provided
            if (filterBy.severity !== undefined && filterBy.severity !== '') {
                bugToReturn = bugToReturn.filter(bug => bug.severity >= filterBy.severity);
            }
    
            // Apply labels filter if provided
            if (filterBy.labels && filterBy.labels.length > 0) {
                bugToReturn = bugToReturn.filter(bug => bug.labels?.some(label => filterBy.labels.includes(label)));
            }
    
            // Sort bugs if sort criteria provided
            if (sortBy.sortField) {
                bugToReturn = bugToReturn.sort((a, b) => {
                    const aValue = a[sortBy.sortField];
                    const bValue = b[sortBy.sortField];
                    return aValue > bValue ? 1 * sortBy.sortDir : -1 * sortBy.sortDir;
                });
            }
    
            return bugToReturn;
        } catch (err) {
            loggerService.error(err);
            throw err;
        }
    }

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw `Couldn't find bug with _id ${bugId}`
        return bug
        return bug
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if(idx<0) throw `could not find bug to remove ${bugId}`
    bugs.splice(idx, 1)
    await _saveBugsToFile('./data/bug.json')
    try {
        _saveBugsToFile('./data/bug.json')
    } catch (err) {
        loggerService.error(err)
        throw err
    }
    return `Bug ${bugId} removed`
}

async function save(bugToSave) {
    try {
        if(bugToSave._id){
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if(idx === -1) throw 'Bad Id'
            bugs.splice(idx, 1, bugToSave)
        } else {
            bugToSave._id = utilService.makeId()
            bugToSave.createdAt = Date.now()
            bugs.push(bugToSave)
        }
        _saveBugsToFile('./data/bug.json')
        return bugToSave
    } catch (err) {
        loggerService.error(err)
        throw err
    }

}

// function _readJsonFile(path) {
//     const str = fs.readFileSync(path, 'utf8')
//     const json = JSON.parse(str)
//     return json
// }

function _saveBugsToFile(path) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}