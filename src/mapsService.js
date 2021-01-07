import axios from 'axios';

export default class MapsService{

    getLocal(localDigitado, responseDialogflow) {
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
}