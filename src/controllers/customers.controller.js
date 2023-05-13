import { db } from '../database/database.connection.js';

export async function getAllCustomers(req, res) {
    try {
        const customers = await db.query("SELECT * FROM customers");

        const allCustomers = customers.rows.map(customer => {
            const { id, name, phone, cpf, birthday } = customer;
            const dateOnly = birthday.toISOString().split('T')[0];
            return { id, name, phone, cpf, birthday: dateOnly };
        });

        res.send(allCustomers);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getCustomersById(req, res) {
    const { id } = req.params;

    try {
        const userById = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);

        if (!userById.rows[0]) {
            return res.sendStatus(404);
        }

        const { birthday, ...rest } = userById.rows[0];
        const dateOnly = birthday.toISOString().split('T')[0];
        const user = { ...rest, birthday: dateOnly };

        res.send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function addCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body

    try {
        await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday) 
                VALUES ('${name}', '${phone}', '${cpf}', '${birthday}')`)
        res.send(201)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function updateCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
        const userExist = await db.query(`
            SELECT * FROM customers WHERE cpf = $1 AND id <> $2`, [cpf, id]);

        if (userExist.rowCount !== 0) {
            return res.sendStatus(409);
        }

        await db.query(`
            UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`, 
            [name, phone, cpf, birthday, id]);

        res.send();
    } catch (error) {
        res.status(500).send(error.message);
    }
}
