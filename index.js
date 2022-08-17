import {createConnection} from 'mysql2/promise';
import { fastify } from "fastify";
import { config } from 'dotenv';
config();
const app = fastify();
const pool = await createConnection(process.env.DATABASE_URL)
app.get("/", (req, res) => {
    res.send("Hello");
})

app.get("/users/:user/:like", (req, res) => {
    const query = req.params.like === "true" ? `select _name, bio, frnd from users where _name like '%${req.params.user}%' limit 10` : `select _name, bio, frnd from users where _name = '${req.params.user}' limit 1`;
    pool.execute(query)
    .then(([row]) => res.send(row))
    .catch((_) => res.status(500).send());
})

app.listen({ port: 3000, host: "0.0.0.0" }).then(console.log);