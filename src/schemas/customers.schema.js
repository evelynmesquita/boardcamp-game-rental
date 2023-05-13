import joi from 'joi'

export const customersSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().length(11).required(),
    cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
    birthday: joi.string().isoDate().required()
}).allow("id", "name", "phone", "cpf", "birthday")