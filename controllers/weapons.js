const express = require('express')
const Weapons = require('../models/weapons')

const router = express.Router()

router.get("/weapons", (req, res) => {
    Weapons.fetch("https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/2221042415", {
    method: 'GET',
        headers: {
            'X-API-KEY': `${process.env.API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then(weapons => {
        const username = req.session.username
        const loggedIn = req.session.loggedIn
        
        res.render('weapons/index', { weapons, username, loggedIn })
    })
    .catch(error => {
        res.redirect(`/error?error=${error}`)
    })
})  

module.exports = router
