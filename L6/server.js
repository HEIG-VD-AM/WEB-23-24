import express from 'express'

import path from 'path'

const people = [
    'Riley',
    'Jordan',
    'Angel',
    'Parker',
    'Sawyer',
    'Peyton',
    'Quinn',
    'Blake',
    'Hayden',
    'Taylor',
    'Dakota',
    'Reese',
    'Zion',
    'Remington',
    'Amari'
]

const facelessPeople = [
    'Satoshi Nakamoto',
    'CopyComic',
    'Banksy',
    'Thomas Bangalter',
    'Guy-Manuel de Homem-Christo'
]

function getPictureFor(user) {
    const index = people.indexOf(user)
    if (index === -1) {
        return 'placeholder_profile.jpg'
    } else {
        return `thispersondoesnotexist${index}.jpg`
    }
}

const app = express()

app.use(express.static('public'))

app.get('/people.json', (req, res) => {
    let sample = new Set([facelessPeople[Math.floor(Math.random() * facelessPeople.length)]])
    while (sample.size < 9) {
        sample.add(people[Math.floor(Math.random() * people.length)])
    }
    sample = [...sample].map(p => ({ p, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.p)

    console.log(`Sending ${JSON.stringify([...sample])}`)
    res.json(JSON.stringify([...sample]))
})

app.get('/picture/:user', async (req, res) => {
    if (req.params.people !== 'placeholder_profile.jpg') {
        const min = 100
        const max = 2000
        const delay = Math.floor(Math.random() * (max - min)) + min
        await new Promise(resolve => setTimeout(resolve, delay))
    }

    const user = req.params.user

    if (!people.includes(user)) {
        res.status(404).send('Not found')
        return
    }

    const picture = 'public/images/' + getPictureFor(req.params.user)
    res.sendFile(path.resolve(picture))
})

export default app
