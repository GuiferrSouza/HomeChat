import { useEffect, useRef } from 'react';

export default function MessageList({ messages, currentUsername }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="message-list">
            {messages.length === 0 ? (
                <div className="no-messages">
                    <p>Nenhuma mensagem ainda.</p>
                    <p>Seja o primeiro a enviar uma mensagem!</p>
                </div>
            ) : (
                messages.map((message) => (
                    <div key={message.id}
                        className={`message ${message.username === currentUsername ? 'own-message' : ''}`}
                        style={{ display: message.content?.length === 0 ? 'none' : 'flex' }}
                    >
                        <div className="message-header">
                            <span className="message-username">{message.username}</span>
                            <span className="message-time">
                                {formatTime(message.createdAt)}
                            </span>
                        </div>

                        <div className="message-content">
                            <p>{message.content}</p>
                        </div>
                    </div>
                ))
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}