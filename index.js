import { createConnection } from 'mysql2/promise';
import { fastify } from "fastify";
import { config } from "dotenv";
config();
const app = fastify();
const pool = await createConnection(process.env.DATABASE_URL)

let cache = [];

app.get("/users/:user/:like", (req, res) => {
    if (req.params.like === "true") {
        pool.execute(`SELECT _name, bio, frnd FROM users WHERE _name like '%${req.params.user}%' LIMIT 10`)
            .then(([rows]) => {
                res.send(rows);
                cacheRequests(rows);
            })
            .catch((_) => res.status(500).send());
    } else {
        const row = cache.find((_row) => _row._name === req.params.user);
        if (row) {
            res.send([row]);
        } else {
            pool.execute(`SELECT bio, frnd FROM users WHERE _name = '${req.params.user}' LIMIT 1`)
                .then(([rows]) => {
                    res.send(rows);
                    if (!rows.length) {
                        rows[0]._name = req.params.user;
                        cacheRequests(rows);
                    }
                })
                .catch((_) => res.status(500).send());
        }
    }
})

async function cacheRequests(rows) {
        rows.forEach(row => {
            const index = cache.indexOf((e) => e._name === row._name)
            if (index == -1) {
                cache.push(row);
            } else {
                cache[index] = row;
            }
            if (cache.length > 1000) {
                cache = cache.slice(500);
            }
        });
}

app.listen({ port: 3000, host: "0.0.0.0" }).then(console.log);