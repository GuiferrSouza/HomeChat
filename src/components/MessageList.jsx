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
                    <p>No messages yet.</p>
                    <p>Be the first to send a message!</p>
                </div>
            ) : (
                messages.map((message) => (
                    <div key={message.id ?? crypto.randomUUID()}
                        className={`message
                            ${message.username === currentUsername ? 'own-message' : ''}
                            ${!message.id ? 'pending-message' : ''}`}
                    >
                        <div className="message-header">
                            <span className="message-username">{message.username}</span>
                            <span className="message-time">{formatTime(message.created_at)}</span>
                        </div>
                        <div className="message-content">
                            <p>{message.id ? message.content : 'Sending...'}</p>
                        </div>
                    </div>
                ))
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}