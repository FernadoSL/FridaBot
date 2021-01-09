import axios from 'axios';

export default class MapsService{

    getPesquisaLocal(localDigitado, responseDialogflow) {
        axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json?location=-30.023438091227717,-51.20140318463954&radius=1500&query=" + localDigitado + "&key=AIzaSyB-P9acNPtZ6d-6pMlmbrUvq_xZDTCCD8M").then((response) => {
    
            var listaLugares = response.data;

            var local = listaLugares.results;

            var listaLocais = "";
            var index;
            for (index = 0; index < local.length; index++) {
                listaLocais += local[index].name + ", endereço: " + local[index].formatted_address + ", ";
                
                var idLocal = "Nome do Lugar: " + listaLocais;
            }
    
            var responseData =
            {
                fulfillmentMessages: [{ text: { text: ["Na minha busca encontrei estes locais por perto. " + idLocal] } }]
            };
    
            responseDialogflow.json(responseData);
        })
    
    }
}