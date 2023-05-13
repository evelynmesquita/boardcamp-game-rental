import { db } from "../database/database.connection.js"

export async function checkGamesValues(req, res, next) {
    const {name, image, stockTotal, pricePerDay} = req.body
   
    if(!name || stockTotal <= 0 || pricePerDay <= 0) return res.sendStatus(400)
    
    try {
        const gameExist = await db.query(`SELECT * FROM games WHERE name = '${name}' limit 1`)
        if(gameExist.rows[0]) {
            return res.sendStatus(409)      
        }

        next()
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}