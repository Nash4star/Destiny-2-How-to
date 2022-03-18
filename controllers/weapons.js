require("dotenv").config()
const express = require('express')
const Weapons = require('../models/weapons')
const fetch = require('node-fetch')
const { response } = require("express")


const router = express.Router()

router.get("/", (req, res) => {
    fetch("https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/922980709", {
    method: 'GET',
        headers: {
            'X-API-KEY': `${process.env.API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })

    .then(responseData => {
        console.log('responceData', responseData)
        responseData.json()
        // console.log('responceDatajson info', responseData.json())
            .then(something => {
                console.log('responseDatajson', something)
                const weapons = something.Response.preview.derivedItemCategories[0].items
                console.log('this is weapons', weapons)
            })
    .then(weapons => {
        // console.log(weapons, "this shows the response from api")
        // const Items = weapons.preview.derivedItemCategories
        // console.log(Items, 'show itmes')
        const username = req.session.username
        const loggedIn = req.session.loggedIn
        
        res.send('weapons/index')
    })
    .catch(error => {
        res.redirect(`/error?error=${error}`)
        })
    })  
})
// shows the users Exoitics
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Weapons.find({ owner: userId })
		.then(weapons => {
			res.render('weapons/index', { weapons, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('weapons/new', { username, loggedIn })
})

router.post('/', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false

	req.body.owner = req.session.userId
	Weapons.create(req.body)
		.then(weapons => {
			console.log('this was returned from create', weapons)
			res.redirect('/weapons')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const weaponsId = req.params.id
	Weapons.findById(weaponsId)
		.then(weapons => {
			res.render('weapons/edit', { weapons })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const weaponsId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	Weapons.findByIdAndUpdate( weaponsId, req.body, { new: true })
		.then(weapons => {
			res.redirect(`/weapons/${weapons.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

router.get('/:id', (req, res) => {
	const weaponsId = req.params.id
	Weapons.findById(weaponsId)
		.then(weapons => {
            const {username, loggedIn, userId} = req.session
			res.render('weapons/show', { weapons, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

router.delete('/:id', (req, res) => {
	const weaponsId = req.params.id
	Weapons.findByIdAndRemove(weaponsId)
		.then(weapons => {
			res.redirect('/weapons')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

module.exports = router
