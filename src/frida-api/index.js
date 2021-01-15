import json from 'body-parser';
import express, { response } from 'express';
import MapsService from "./mapsService.js";
import dotenv from 'dotenv'

var mapsService = new MapsService();

const app = express();
app.use(json());
dotenv.config();

// linha de código para saber se o método get está funcionando
app.get('/status', (request, response) => {
   
    response.json({ status: "OK" })

});

app.post('/webhook', (request, response) => {
    var data = request.body;
    console.log(data);

    var intentName = data.queryResult.intent.displayName;
    console.log(intentName);

    var localDigitado = data.queryResult.queryText;
    console.log(localDigitado);

    mapsService.getPesquisaLocal(localDigitado,response);
})

app.listen(process.env.PORT || 4200);