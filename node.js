
var restify = require('restify');        // sevidor
var builder = require('botbuilder');

var server = restify.createServer();    //crear servidor

server.listen(                         //se escucha puerto 3978
    process.env.port ||
    process.env.PORT ||
    
    3978, function(){ console.log('%s listening to %s',server.name,server.url);});


var connector = new builder.ChatConnector({   //conexion chat
    appId: '',
    appPassword: ''});

var bot = new builder.UniversalBot(connector);
server.post('api/messages', connector.listen());

bot.dialog('/', [                              //Comienzo dialogo
    function(session,result){
    builder.Prompts.text(session, '¡Bienvenido a su tienda en linea!');

    session.send({
        type: "message",
        attachments: [              //archivo adjunto
          {
            contentType: "image/jpg",
            contentUrl: "Users/Andrea/Documents/BOT/img/mercadolibre.jpg",
            name: "mercadolibre.jpg"
          }
        ]});
    
        if(!session.userData.nombre){           
            session.send('¿Como te llamas?');
        }
        else{ session.endDialog(`¡Hola volviste ${session.userData.nombre}!`);}
    },

    function(session,results){
        if(!session.userData.nombre){
            let nombre = results.response;
            session.userData.nombre = nombre;

            session.endDialog('Muy bien');
        }

    session.beginDialog('/PreguntarSiPedido');}]);

bot.dialog('/PreguntarSiPedido', [
    function(session){builder.Prompts.text(session, `¿${session.userData.nombre} deseas comprar algo?`);},
    function(session,results){
        if(results.response){session.dialogData.respuesta = results.response;
            if(session.dialogData.respuesta == 'si' ||
            session.dialogData.respuesta == 'Si' || 
            session.dialogData.respuesta == 'SI' ||
            session.dialogData.respuesta == 'sI'){
        
                session.dialogData.siguienteDialogo = '/Que tipo de articulo?';   

            }else if(session.dialogData.respuesta == 'no' ||
            session.dialogData.respuesta == 'No' ||
            session.dialogData.respuesta == 'NO' ||
            session.dialogData.respuesta == 'nO'){
                session.dialogData.siguienteDialogo = '/Nohaycompra';

            }else{session.dialogData.siguienteDialogo = '/ResDifPedido';}}

        session.beginDialog(session.dialogData.siguienteDialogo);
    }
]);

bot.dialog('/tipoarticulo', [
    function(session){

        if(session.conversationData.respuestaarticulo== 1 ||
            session.conversationData.respuestaarticulo >= 3){
            
            builder.Prompts.text(session, `Disculpa ${session.userData.nombre} no te entiendo, por favor selecciona uno de los articulos:\n- Computadores\n- Celulares\n- Consolas de videojuegos`);

        }else if(session.conversationData.respuestaarticulo == 2){
            builder.Prompts.text(session, `¡Por favor repita su respuesta😟!`);
            session.send(`Selecciona uno de los articulos:\n- Computadores\n- Celulares\n- Consolas de videojuegos`);
        }else{            
            session.conversationData.respuestaarticulo = 0;
            builder.Prompts.text(session, `selecciona uno de los articulos:\n- Computadores\n- Celulares\n- Consolas de videojuegos`);
        
        }

    },
    function(session,results){
        if(results.response){
            session.conversationData.tipoarticulo = results.response;
            
            if(session.conversationData.tipoarticulo == 'computadores'||
            session.conversationData.tipoarticulo == 'computadores'||
            session.conversationData.tipoarticulo == 'computadores'||
            session.conversationData.tipoarticulo== 'Celulares'||
            session.conversationData.tipoarticulo == 'Celulares'||
            session.conversationData.tipoarticulo == 'CELULARES'||
            session.conversationData.tipoarticulo == 'Consolas de videojuegos'||
            session.conversationData.tipoarticulo == 'Consolas de videojuegos'||
            session.conversationData.tipoarticulo == 'CONSOLAS DE VIDEOJUEGOS'){

                session.endDialog();
                session.beginDialog('/pecioarticulo');

            }else{
                
                session.conversationData.respuestatipo = session.conversationData.respuestatipo + 1;
                session.endDialog();
                session.beginDialog('/tipoarticulo');
                
            }
        }
    }
]);

bot.dialog('/precioarticulo', [
    function(session){
        if(session.conversationData.respuestaprecio >= 1){builder.Prompts.text(session, ` selecciona uno de los precios que tenemos:\n- 600.000\n- 700.000\n- \n- 1.000.000\n- `);
            
        }else{ session.conversationData.respuestaprecio = 0;
            builder.Prompts.text(session, `Ahora puedes escoger el precio del articulo que quieres:\n- 600.000\n- 700.000\n- \n- 1.000.000\n- `);
        
        }
    },
    function(session,results){
        if(results.response){
            session.conversationData.precioarticulo = results.response;

            if(session.conversationData.saborPizza == '600.000' ||
            session.conversationData.precioarticulo== '600.000' ||
            session.conversationData.precioarticulo == '600.000' ||
            session.conversationData.precioarticulo == '700.000' ||
            session.conversationData.precioarticulo == '700.000' ||
            session.conversationData.precioarticulo == '700.000' ||
            session.conversationData.precioarticulo == '1.000.000' ||
            session.conversationData.precioarticulo == '1.000.000' ||
            session.conversationData.precioarticulo == '1.000.000' ||
            session.conversationData.precioarticulo == '1.200.000' ||
            session.conversationData.precioarticulo == '1.200.000' ||
            session.conversationData.precioarticulo == '1.200.000'){

                session.endDialog('¡Excelente elección!');
                session.beginDialog('/Direccion');

            }else if(session.conversationData.precioarticulo == '´Psp 2.000.000' ||
            session.conversationData.precioarticulo == 'Psp 2.000.000' ||
            session.conversationData.precioarticulo == 'Psp 2.000.000' ){

                session.endDialog();
                session.beginDialog('/Agotado');

            }else {
                session.conversationData.respuestaprecio = session.conversationData.respuestaprecio + 1;
                session.beginDialog('/precioarticulo');}

        }
    }
]);

bot.dialog('/Agotado', [
    function(session){

        if(session.conversationData.respuestaSiNo == 1){

            builder.Prompts.text(session,'Disculpa no te entiendo, por favor responde si o no, gracias!.');
            session.send('¿Aun quieres comprar algo?');
        }else {
            session.conversationData.respuestaSiNo = 0;
            builder.Prompts.text(session,'se nos agoto vuelve la proxima semana.');
            session.send('¿Aun quieres pedir algun articulo?');
        }   
    },
    function(session,results){
        if(results.response){
            session.dialogData.respuesta =  results.response;

            if(session.dialogData.respuesta == 'si' ||
            session.dialogData.respuesta == 'Si' || 
            session.dialogData.respuesta == 'SI' ||
            session.dialogData.respuesta == 'sI'){
        
                session.endDialog('¡Genial!');
                session.beginDialog('/:D');

            }else if(session.dialogData.respuesta == 'no' ||
            session.dialogData.respuesta == 'No' ||
            session.dialogData.respuesta == 'NO' ||
            session.dialogData.respuesta == 'nO'){

                session.endConversation('En verdad lo sentimos no se encuentra!');
            }else{
                session.conversationData.respuestaSiNo = 1;
                session.endDialog();
                session.beginDialog('/Agotado');}
        }
    }
]);

bot.dialog('/Direccion',[
    function(session){

        if(session.userData.direccion == '0'){
            builder.Prompts.text(session,'Por favor ingresa tu nueva direccion! gracias :)');
        }else if(session.userData.direccion){
            session.endDialog(`${session.userData.nombre} ¿tu direccion para envio aun es: ${session.userData.direccion}?`);
            session.beginDialog('/DirSiConoce');
        }else {builder.Prompts.text(session,'¿Cual es la dirección para enviar tu Pizza Panucci´s?');}
    },
    function(session,results){
        if(results.response){
            session.userData.direccion = results.response;
        }
        
        session.endDialog();
        session.beginDialog('/Envio')
    }
]);

bot.dialog('/DirSiConoce', [
    function(session){
        builder.Prompts.text(session,'Por favor responde "Si" o "No"');
    },
    function(session,results){
        if(results.response){
            let respuesta = results.response;
            if(respuesta == 'si' ||
            respuesta == 'Si' || 
            respuesta == 'SI' ||
            respuesta == 'sI'){
                session.endDialog('¡Genial!😀');
                session.beginDialog('/Envio');

            }else if(respuesta == 'no' ||
            respuesta == 'No' ||
            respuesta == 'NO' ||
            respuesta == 'nO'){

                session.endDialog();
                session.userData.direccion = '0';
                session.beginDialog('/Direccion');
            }else{
                session.endDialog('No te entiendo');
                session.beginDialog('/DirSiConoce');

            }
        }
    }
]);

bot.dialog('/Envio', [
    function(session){
        builder.Prompts.text(session,'Todo listo,espera nuestro domicilio!');
        session.send({
            type: "message",
            attachments: [
              {
                contentType: "img/gif",
                contentUrl: "Users/Andrea/Documents/BOT/img/envio.gif",
                name: "envio.gif"
              }
            ]
          });
    },
    function(session,results){
        if(results.response){
            let envio = results.response;
            if(envio == 'gracias' ||
            envio == 'gracias!'){
                session.send(`Con gusto ${session.userData.nombre}, ¡disfruta de nuestros productos!🍕🍕`)
                session.endConversation();

            }else if (envio == 'cuanto tarda?'||
            envio == 'cuanto tarda'){
                session.endDialog('Aproximadamente 2 dias en llegar! :)');
                session.beginDialog('/Envio');
            }else {
                session.send('Gracias por visitarnos hasta pronto!');
                session.endConversation();
            }

        }
    }
]);

bot.dialog('/NoPedidoSaludos', [
    function(session){

        if(!session.userData.nombre){
            builder.Prompts.text(session, ` ¡Hasta pronto!`);
        }else{
            builder.Prompts.text(session, ` ${session.userData.nombre}  ahora, ¡Hasta pronto!`);
        }
        session.endConversation();
    }
]);

bot.dialog('/ResDifPedido', [
    function(session){
        builder.Prompts.text(session, `Digite nuevamente su respuesta`);
        session.endDialog();
        session.beginDialog('/PreguntarSiPedido');
    }
]);
