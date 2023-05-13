import {Router} from 'express';
import { getAllGames, registerNewGame } from '../controllers/game.controller.js';
import { checkGamesValues } from '../middlewares/games.middleware.js'
import validateSchema from '../middlewares/validate.schemas.js';
import { gamesSchema } from '../schemas/games.schema.js';

const gamesRoutes = Router();

gamesRoutes.get("/games",getAllGames);
gamesRoutes.post("/games",checkGamesValues, validateSchema(gamesSchema), registerNewGame);

export default gamesRoutes;