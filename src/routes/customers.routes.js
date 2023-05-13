import {Router} from 'express'
import { addCustomer, getAllCustomers, getCustomersById, updateCustomer } from '../controllers/customers.controller.js'
import { checkCustomersValues } from '../middlewares/customers.middleware.js'
import validateSchema from '../middlewares/validate.schemas.js'
import { customersSchema } from '../schemas/customers.schema.js'

const customersRoutes = Router();

customersRoutes.get("/customers", getAllCustomers);
customersRoutes.get("/customers/:id", getCustomersById);
customersRoutes.post("/customers", checkCustomersValues, validateSchema(customersSchema),addCustomer);
customersRoutes.put("/customers/:id", validateSchema(customersSchema),updateCustomer);

export default customersRoutes;