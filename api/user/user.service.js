import fs from 'fs'

import { loggerService } from '../../services/logger.service.js'
import { utilService } from './../../services/util.service.js';

export const userService = {
    query,
    getById,
    remove,
    save,
}

var users = utilService.readJsonFile('./data/user.json')
const PAGE_SIZE = 12

async function query(filterBy = {}, sortBy = {}) {
    console.log("filterBy: ", filterBy,"sortBy: ", sortBy)
    try {
        let usersToReturn = [...users]
        if (filterBy.pageIdx) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            usersToReturn = usersToReturn.slice(startIdx, startIdx + PAGE_SIZE)
        }
        return usersToReturn
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(userId) {
    try {
        var user = users.find(user => user._id === userId)
        if (!user) throw `Couldn't find user with _id ${userId}`
        return user
    } catch (err) {
        loggerService.error(err)
        throw (err)
    }
}

async function remove(userId) {
    try {
        const idx = users.findIndex(user => user._id === userId)
        if (idx === -1) throw `Couldn't find user with _id ${userId}`
        users.splice(idx, 1)

        _saveUsersToFile('./data/user.json')
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function save(userToSave) {
    try {
        if (userToSave._id) {
            var idx = users.findIndex(user => user._id === userToSave._id)
            if (idx === -1) throw `Couldn't find user with _id ${userToSave._id}`
            users.splice(idx, 1, userToSave)
        } else {
            userToSave._id = utilService.makeId()
            users.push(userToSave)
        }
        await _saveUsersToFile('./data/user.json')
        return userToSave
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

function _saveUsersToFile(path) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}