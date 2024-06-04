const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', (client) => {
    console.log('Cliente conectado');

    // console.log(client.handshake.headers['x-token']);
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    // console.log(valido, uid);

    if (!valido) {
        return client.disconnect();
    }

    usuarioConectado(uid);

    // Ingresar al usuario a una sala en particular
    // sala global, client.id, 664682a562690224a6c8a7bf
    client.join(uid);

    // client.to(uid).emit('');

    // Escuchar el cliente el mensaje-personal
    client.on('mensaje-personal', async (payload) => {
        console.log(payload);

        // Grabar mensaje
        await grabarMensaje(payload);

        io.to(payload.para).emit('mensaje-personal', payload);
    });

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);

    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    // });


});
