const chalk = require('chalk');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const axios = require("axios");
const http = require('http');
const url = require('url');
const fs = require('fs');

let i = 1;
let template = "";
async function getUsuarios() {
    try {
        const { data } = await axios.get("https://randomuser.me/api");
        const results = data.results[0];
        let nombre = results.name.first;
        let apellido = results.name.last;

        return { nombre, apellido };
    } catch (error) {
        console.log("error", error);
    }
}

http.createServer((req, res) => {

    const params = url.parse(req.url, true).query;
    console.log(req.url);

    if (req.url.includes("/usuarios")) {
        fs.readFile("usuarios.txt", 'utf8', (error, data) => {

            getUsuarios().then(registro => {

                const uuid = uuidv4();
                const id = uuid.slice(0, 6);
                const fecha = moment().format('MMMM Do YYYY, h:mm:ss a');

                template = `${i++}.`;
                template += `Nombre: ${registro.nombre} - `;
                template += `Apellido: ${registro.apellido} - `;
                template += `ID: ${id} - `;
                template += `Timestamp: ${fecha}\n`;

                console.log(chalk.blue.bgWhite(template));

                // res.write(`<body><ol><li>${template}</li></ol></body>`);

                res.write(data);
                res.end();
                fs.writeFile("usuarios.txt", data + template, () => {
                    // console.log('sobrescrito');
                    res.end();
                })
            });

        })
    }
}).listen(8080);