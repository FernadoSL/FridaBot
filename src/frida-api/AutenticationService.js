import fs from 'fs';
import readline from 'readline';
import {google} from 'googleapis';


// Se modificar esses escopos, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// O arquivo token.json armazena os tokens de acesso e atualização do usuário e é
// criado automaticamente quando o fluxo de autorização é concluído pela primeira
// vez.

const TOKEN_PATH = 'token.json';


export default class AutenticaUsuario{
  
  // Carregue os segredos do cliente de um arquivo local.
  readFile(responseDialogflow){
    fs.readFile('credentials.json', (err, content) => {
    
      if (err) return console.log('Erro ao carregar o arquivo secreto do cliente:', err);
      // Autorize um cliente com credenciais e chame a API do Google Agenda.
      var teste = JSON.parse(content)
      this.authorize(teste, responseDialogflow, this.listEvents);
    });
  }
  

  /*
  * Crie um cliente OAuth2 com as credenciais fornecidas e execute a
  * função de callback fornecida.
  * @param {Object} credentials As credenciais do cliente de autorização.
  * @param {function} callback O retorno de chamada para chamar com o cliente autorizado.
  */
 
    authorize(credentials, responseDialogflow, callback) {
      const {client_secret, client_id, redirect_uris} = credentials.web;
      const oAuth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uris[0]);

          // Verifique se já armazenamos um token.
          fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return this.getAccessToken(oAuth2Client, responseDialogflow, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
          });
    }

    /*
    * Obtenha e armazene o novo token após solicitar a autorização do usuário e, em seguida,
    * execute o retorno de chamada fornecido com o cliente OAuth2 autorizado.
    * @param {google.auth.OAuth2} oAuth2Client O cliente OAuth2 para o qual obter o token.
    * @param {getEventsCallback} callback O retorno de chamada para o cliente autorizado.
    */
    
    getAccessToken(oAuth2Client, responseDialogflow, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
        });

        var responseData = 
        {
          fulfillmentMessages: [{ text: { text: ["Autorize este aplicativo visitando este url: ", authUrl ] } }]
        }
        responseDialogflow.json(responseData);
        
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
      
        rl.question('Insira o código dessa página aqui: ', (code) => {
          rl.close();

        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error('Erro ao recuperar token de acesso', err);
            oAuth2Client.setCredentials(token);

            // Armazene o token no disco para execuções posteriores do programa
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
              if (err) return console.error(err);
              console.log('Token armazenado em', TOKEN_PATH);
            });
          callback(oAuth2Client);
        });
      });
    }
  

  /*
  * Lista os próximos 10 eventos no calendário principal do usuário.
  * @param {google.auth.OAuth2} auth Um cliente OAuth2 autorizado.
  */
   listEvents(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('A API retornou um erro: ' + err);
          const events = res.data.items;
          
        if (events.length) {
              console.log('Próximos 10 eventos:');
              events.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
              });
          } else {
            console.log('Nenhum evento futuro encontrado.');
          }
    });
   }
  }
