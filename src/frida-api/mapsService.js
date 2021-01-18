import axios from 'axios';

export default class MapsService{

    getPesquisaLocal(localDigitado, responseDialogflow) {

        var apiKey = process.env.API_KEY;

        axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json?location=-30.023438091227717,-51.20140318463954&radius=300&query=" + localDigitado + "&key=" + apiKey).then((response) => {
    
            var listaLugares = response.data;

            var local = listaLugares.results;

            var listaLocais = "";
            var index;
            for (index = 0; index < local.length; index++) {
                
                var nomeLocal = local[index].name;

                
                var enderecoDividido = local[index].formatted_address.split(", ");
                var enderecoFinal = enderecoDividido[0] + enderecoDividido[1] + enderecoDividido[2];
                
                listaLocais += "Nome do Lugar: " + nomeLocal + ", endereço: " + enderecoFinal + "; ";
                
                var idLocal = listaLocais;
            }
    
            var responseData =
            {
                fulfillmentMessages: [{ text: { text: ["Na minha busca encontrei estes locais por perto. " + idLocal] } }]
            };
    
            responseDialogflow.json(responseData);
        })
    
    }
}