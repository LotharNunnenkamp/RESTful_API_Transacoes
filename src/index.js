const express = require('express');

const rotas = require('./rotas/rotas.js')

const app = express();

app.use(express.json());

app.use(rotas);

app.listen(3000, () => {
    console.log(`Servidor ouvindo porta ${process.env.PORT}`);
}).on("error", (err) => {
    process.once("SIGUSR2", () => {
        process.kill(process.pid, "SIGUSR2");
    })
})