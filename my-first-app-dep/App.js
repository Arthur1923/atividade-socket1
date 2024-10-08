import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, Text, TextInput, FlatList } from "react-native";
import socket from "./socket"; // Certifique-se de que isso está importando corretamente

const ChatForm = ({ messages, onSend, username }) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <View style={styles.formContainer}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={[styles.message, item.username === 'Taka' ? styles.messageTaka : styles.messageFelipe]}>
            <Text style={styles.username}>{item.username}: </Text>
            {item.message}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageList}
      />
      <TextInput
        placeholder='Digite sua mensagem'
        value={message}
        onChangeText={setMessage}
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={sendMessage}>
        <Text style={styles.buttonText}>Enviar</Text>
      </Pressable>
    </View>
  );
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const usernameBlue = 'Taka'; 
  const usernameRed = 'Fillipi'; 

  useEffect(() => {
    setMessages([]);

    // Entrando nas salas correspondentes
    socket.emit('join_room', 'blue');
    socket.emit('join_room', 'red');

    const handleReceiveMessage = ({ message, username }) => {
      setMessages(prevMessages => [...prevMessages, { message, username }]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  const handleSend = (message, username) => {
    socket.emit('send_message', { message, username });
    setMessages(prevMessages => [...prevMessages, { message, username }]);
  };

  return (
    <View style={styles.container}>
      <ChatForm
        messages={messages}
        onSend={(message) => handleSend(message, usernameBlue)}
        username={usernameBlue}
      />
      <ChatForm
        messages={messages}
        onSend={(message) => handleSend(message, usernameRed)}
        username={usernameRed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
  },
  formContainer: {
    width: '48%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  input: {
    height: 40,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageList: {
    maxHeight: '70%',
  },
  message: {
    padding: 5,
    borderRadius: 5,
    marginVertical: 2,
  },
  messageTaka: {
    backgroundColor: '#FFD700', // Amarelo para Taka
  },
  messageFelipe: {
    backgroundColor: '#FF6347', // Vermelho para Felipe
  },
  username: {
    fontWeight: 'bold',
    color: '#333',
  },
});
