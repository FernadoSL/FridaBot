import json from 'body-parser';
import express, { response } from 'express';
import axios from 'axios';

const app = express();
app.use(json());

// linha de código para saber se o método get está funcionando
app.get('/status', (request, response) => {
   
    response.json({ status: "OK" })

});

app.post('/webhook', (request, response) => {
    var data = request.body;
    console.log(data);

    var intentName = data.queryResult.intent.displayName;
    console.log(intentName);

    var localDigitado = data.queryResult.parameters.location.city;
    console.log(localDigitado);

    getLocal(localDigitado, response);
})

function getLocal(localDigitado, responseDialogflow) {
    axios.get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + localDigitado + "&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyB-P9acNPtZ6d-6pMlmbrUvq_xZDTCCD8M").then((response) => {

        var listaLugares = response.data;

        var localDigitado = listaLugares.candidates[0].formatted_address;
        var localNome = listaLugares.candidates[0].name;

        var idLocal = "Endereço: " + localDigitado + ", nome do Local: " + localNome;

        var responseData =
        {
            fulfillmentMessages: [{ text: { text: ["Achei o local! " + idLocal] } }]
        };

        responseDialogflow.json(responseData);
    })

}

app.listen(process.env.PORT || 4200);