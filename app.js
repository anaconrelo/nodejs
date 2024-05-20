const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log('Server is Started on', PORT);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log("Connected ", socket.id);
    socket.on('disconnect', () => {
        console.log("Disconnected ", socket.id);
    });

    socket.on('join-room', (room) => {
        socket.join(room.room);
        console.log(`Socket ${socket.id} joined room ${room.room}`);
    });

    socket.on('requestOffer', (data) => {
        const { room, message } = data;
        console.log(`Message from ${socket.id} is ${message}`)
        socket.to(room).emit('message-receive', message)
    })

    socket.on('sendOffer', (data) => {
        const { room, offerSDP, offerType, guardName, guardRole, ices } = data;
        const offerData= {
            offerSDP: offerSDP,
            offerType: offerType,
            guardName: guardName,
            guardRole: guardRole,
            ices: ices
        }

        console.log(`Sending offer to room ${room}: ${ices}`)
        socket.to(room).emit('message-receive', offerData)
    })

    socket.on('sendAnswer', (data) => {
        const { room, answerSDP, answerType, ices } = data;
        const answerData= {
            answerSDP: answerSDP,
            answerType: answerType,
            ices: ices
        }

        console.log(`Sending answer to room ${room}: ${ices}`)
        socket.to(room).emit('answer-receive', answerData)
    })

    socket.on('hangUp', (data) => {
        const { room, message } = data;
        const messageData = {
            messageData: message,
        }
        console.log(`Hanging Up: ${room} and ${message}`);
        socket.to(room).emit('hangUp', messageData)
    })

    socket.on('hangUpCaller', (data) => {
        const { room, message } = data;
        const messageData = {
            messageData: message,
        }
        console.log(`Hanging Up: ${room} and ${message}`);
        socket.to(room).emit('hangUpCaller', messageData)
    })

    socket.on('declineCaller', (data) => {
        const { room, message } = data;
        const messageData = {
            messageData: message,
        }
        console.log(`Decline: ${room} and ${message}`);
        socket.to(room).emit('declineCaller', messageData)
    })

    socket.on('message', (data) => {
        const { room, message } = data;
        const messageData = {
            messageData: message,
        }
        console.log(`Message from ${socket.id} to room ${room}: ${message}`);
        socket.to(room).emit('message-receive', messageData);
    });
});