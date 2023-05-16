import dayjs from "dayjs";
import { db } from "../database/database.connection.js";


export async function addNewRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const [customer, game, gameAvailable] = await Promise.all([
            db.query('SELECT * FROM customers WHERE id = $1;', [customerId]),
            db.query('SELECT * FROM games WHERE id = $1;', [gameId]),
            db.query(
                'SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;',
                [gameId]
            ),
        ]);

        if (
            customer.rowCount === 0 ||
            game.rowCount === 0 ||
            gameAvailable.rowCount >= game.rows[0].stockTotal
        ) {
            return res.sendStatus(400);
        }

        const rentDate = dayjs().format('YYYY-MM-DD');
        const originalPrice = daysRented * game.rows[0].pricePerDay;

        await db.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                VALUES ($1, $2, $3, $4, $5, $6, $7);`,
                [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
        );

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export async function getAllRentals(req, res) {
    try {
        const rentals = await db.query(`
        SELECT rentals.*, 
        json_build_object('id', customers.id, 'name', customers.name) AS customer,
        json_build_object('id', games.id, 'name', games.name) AS game
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id
        `
        )

        res.send(rentals.rows)
    } catch (error) {
        res.status(500).send(error.message)
    }
}


export async function returnRental(req, res) {
    const { id } = req.params;
    const today = dayjs().format('YYYY-MM-DD');

    try {
        const rental = await db.query('SELECT * FROM rentals WHERE id = $1;', [id]);
        const rentDate = dayjs(rental.rows[0].rentDate);
        const daysRented = rental.rows[0].daysRented;

        const returnDate = today;
        const delayDays = dayjs().diff(rentDate, 'day') - daysRented;
        const pricePerDay = rental.rows[0].originalPrice / daysRented;
        const delayFee = Math.max(0, delayDays) * pricePerDay;

        await db.query(
            'UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;',
            [returnDate, delayFee, id]
        );

        res.send();
    } catch (error) {
        res.status(500).send(error.message);
    }
}


export async function deleteRental(req, res) {
    const { id } = req.params;

    try {
        const rental = await db.query('SELECT * FROM rentals WHERE id = $1;', [id]);
        if (rental.rows.length === 0) return res.sendStatus(404);

        if (rental.rows[0].returnDate === null) return res.sendStatus(400);

        await db.query('DELETE FROM rentals WHERE id = $1;', [id]);
        res.send();
    } catch (error) {
        res.status(500).send(error.message);
    }
}
