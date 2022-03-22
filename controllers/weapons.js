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
        // console.log('responceData', responseData)
        responseData.json()
        // console.log('responceDatajson info', responseData.json())
            // to get the information to be processed into a form that can be read in json.
            .then(something => {
                // console.log('responseDatajson', something)
                const weapons = something.Response.preview.derivedItemCategories[0].items
                console.log('These are the itemHash', weapons)
                console.log('this is itemHash for index 0' ,weapons[0].itemHash)
                const username = req.session.username
                const loggedIn = req.session.loggedIn
                res.render('weapons/list', { weapons, username, loggedIn })
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

// router.get("/weapons/list", (req, res) => {
     
// })

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
    console.log('weapons it', weaponsId)
    fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${weaponsId}`, {
    method: 'GET',
        headers: {
            'X-API-KEY': `${process.env.API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })

    .then(responseData => {
        // console.log('responceData', responseData)
        return responseData.json()
        // console.log('responceDatajson info', responseData.json())
            // to get the information to be processed into a form that can be read in json.
        })
        .then(something => {
                console.log('These are the itemHash', something)
                // console.log('responseDatajson', something)
                const name = something.Response.displayProperties.name
                console.log('this is the name', name)
                const lore = something.Response.flavorText
                console.log('lore', lore)
                const weaponsStat = something.Response.stats.stats['1931675084'].value
                console.log('weaponStats', weaponsStat)
                
                const username = req.session.username
                const loggedIn = req.session.loggedIn
                res.render('weapons/show', { name, lore, username, loggedIn })
        })
            
    .catch(error => {
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
