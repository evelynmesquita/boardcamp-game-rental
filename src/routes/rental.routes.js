import { Router } from 'express'
import { addNewRental, deleteRental, getAllRentals, returnRental } from '../controllers/rental.controller.js';
import { checkRental, checkRentalValues } from '../middlewares/rental.middleware.js';
import validateSchema from '../middlewares/validate.schemas.js';
import { rentalSchema } from '../schemas/rental.schema.js';

const rentalRoutes = Router();

rentalRoutes.post("/rentals", checkRentalValues, validateSchema(rentalSchema),addNewRental);
rentalRoutes.get("/rentals", getAllRentals);
rentalRoutes.post("/rentals/:id/return", checkRental,returnRental);
rentalRoutes.delete("/rentals/:id", deleteRental);

export default rentalRoutes;