const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express(); // Inicializando o Express
const server = http.createServer(app); // Criando o servidor HTTP
const io = new Server(server); // Inicializando o Socket.IO

io.on("connection", (socket) => { // Evento de conexão
    console.log("Um cliente se conectou");

    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`Cliente entrou no canal: ${room}`);
    });
    
    socket.on('send_message', ({ room, message, username }) => {
        console.log(`Mensagem recebida de ${username} na sala ${room}: ${message}`); // Log da mensagem recebida
        io.to(room).emit('receive_message', { message, username }); // Emite a mensagem para a sala correta
    });

    socket.on("disconnect", () => {
        console.log("Um cliente se desconectou");
    });
});
 
server.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
