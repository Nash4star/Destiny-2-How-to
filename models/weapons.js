const mongoose = require('./connection')

const User = require('./user')

const { Schema, model } = mongoose

const weaponsSchema = new Schema(
	{
		title: { type: String, required: true},
		lore: { type: String, required: true },
        rpm: { type: Number, required: true },
        impact: { type: Number, required: true },
        range: { type: Number, required: true },
        stability: { type: Number, required: true },
        handling: { type: Number, required: true },
        reload_speed: { type: Number, required: true },
        magazine: { type: Number, required: true },
		exotic_perk: { type: String, required: true },
        perk: { type: String, required: true },
        collected: {type: Boolean},
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Weapons = model('Weapons', weaponsSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Weapons
