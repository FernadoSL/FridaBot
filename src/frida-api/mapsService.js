import axios from 'axios';

export default class MapsService{

    getPesquisaLocal(localDigitado, responseDialogflow) {
        axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + localDigitado + "&key=AIzaSyB-P9acNPtZ6d-6pMlmbrUvq_xZDTCCD8M").then((response) => {
    
            var listaLugares = response.data;

            var local = listaLugares.results;

            var listaLocais = "";
            var index;
            for (index = 0; index < local.length; index++) {
                listaLocais += local[index].name;
                
                var idLocal = "Nome do Lugar: " + listaLocais;
            }
    
            var responseData =
            {
                fulfillmentMessages: [{ text: { text: ["Encontrei esses lugares! " + idLocal] } }]
            };
    
            responseDialogflow.json(responseData);
        })
    
    }
}