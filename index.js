
const fastify = require('fastify').fastify();


fastify.get("/", (req, res) => {
    res.send("Hello");
})
fastify.listen({port: 3000, host: "0.0.0.0"}).then(console.log);