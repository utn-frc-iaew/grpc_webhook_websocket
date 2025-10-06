import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';

import { getSocket } from '../api/socket';

interface Message {
  author: string;
  text: string;
  createdAt: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [author, setAuthor] = useState('anonymous');
  const [text, setText] = useState('');

  useEffect(() => {
    const socket = getSocket('chat');

    const handler = (message: Message) => {
      setMessages((prev: Message[]) => [...prev.slice(-19), message]);
    };

    socket.on('message', handler);

    return () => {
      socket.off('message', handler);
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    const socket = getSocket('chat');
    socket.emit('message', { author, text });
    setText('');
  };

  const onSubmit = () => {
    sendMessage();
  };

  const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <section>
      <h2>Chat</h2>
      <div className="chat-messages">
  {messages.map((message: Message, index: number) => (
          <div key={`${message.createdAt}-${index}`} className="chat-message">
            <strong>{message.author}</strong>: {message.text}
            <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="chat-controls">
        <input
          value={author}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setAuthor(event.target.value)}
          placeholder="Nombre"
        />
        <input
          value={text}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setText(event.target.value)}
          onKeyDown={onKeyPress}
          placeholder="Mensaje"
        />
        <button type="button" onClick={onSubmit}>
          Enviar
        </button>
      </div>
    </section>
  );
};
