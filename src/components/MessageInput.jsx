import { useState } from 'react';
import { Send } from 'lucide-react';

export default function MessageInput({ onSendMessage, disabled }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        onSendMessage(message);
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="message-input">
            <input type="text" placeholder="Type your message..."
                value={message} onChange={(e) => setMessage(e.target.value)}
                maxLength={1000} disabled={disabled}
            />
            <button type="submit" disabled={disabled || !message.trim()}>
                <Send size={20} />
            </button>
        </form>
    );
}