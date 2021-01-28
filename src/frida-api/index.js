import json from 'body-parser';
import express, { response } from 'express';
import dotenv from 'dotenv';
import MapsService from "./mapsService.js";
import getAccessToken from './autenticationService.js';
import CalendarService from './calendarService'


var mapsService = new MapsService();
var calendarService = new CalendarService();

const app = express();
app.use(json());
dotenv.config();

// linha de código para saber se o método get está funcionando
app.get('/status', (request, response) => {
   
    response.json({ status: "OK" })

});

app.post('/webhook', (request, response) => {
    var data = request.body;

    var intentName = data.queryResult.intent.displayName;

    var localDigitado = data.queryResult.queryText;
    console.log(localDigitado);

    mapsService.getPesquisaLocal(localDigitado,response);

    // TODO intent de reserva do local do hotel
    if (intentName == 'Intent-fazer-reserva-local-hotel'){
        
        getAccessToken();
    }
    // TODO intent reserva de um quarto
    if(intentName == 'Intent-fazer-reserva-quarto'){

    }
})

app.listen(process.env.PORT || 4200);