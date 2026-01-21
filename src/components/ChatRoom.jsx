import { useState, useEffect, useRef, memo } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { getMessages, createMessage } from '../services/api';
import { RefreshCw } from 'lucide-react';

const MemoizedMessageInput = memo(MessageInput);

export default function ChatRoom({ room, username, onOpenRooms }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const lastMessageIdRef = useRef(null);

    const loadMessages = async (isPolling = false) => {
        if (!room) return;

        if (!isPolling) setLoading(true);
        setError(null);

        try {
            const data = await getMessages(room.id);
            const sortedMessages = data.reverse();

            if (sortedMessages.length > 0) {
                const latestMessageId = sortedMessages[sortedMessages.length - 1].id;

                if (latestMessageId !== lastMessageIdRef.current) {
                    setMessages(sortedMessages);
                    lastMessageIdRef.current = latestMessageId;
                }

            } else if (messages.length > 0) {
                setMessages([]);
                lastMessageIdRef.current = null;
            }
        } catch (err) {
            setError('Error loading messages');
            console.error(err);
        } finally {
            if (!isPolling) setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();

        const interval = setInterval(() => loadMessages(true), 3000);
        return () => clearInterval(interval);
    }, [room]);

    const handleSendMessage = async (content) => {
        try {
            const newMessage = await createMessage(room.id, username, content);
            setMessages((prev) => [...prev, newMessage]);
            lastMessageIdRef.current = newMessage.id;
        } catch (err) {
            alert('Error sending message');
            console.error(err);
        }
    };

    const handleSendMessageCallback = useRef(handleSendMessage);
    handleSendMessageCallback.current = handleSendMessage;

    if (!room) {
        return (
            <div className="chat-room empty">
                <p>Select a room to start chatting</p>
            </div>
        );
    }

    return (
        <div className="chat-room">
            <div className="chat-header">
                <button className="open-rooms-btn" onClick={onOpenRooms}>
                    Rooms
                </button>
                <h2>{room.name}</h2>
                <button onClick={() => loadMessages()} disabled={loading} className="refresh-btn">
                    <RefreshCw size={20} className={loading ? 'spinning' : ''} />
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <MessageList messages={messages} currentUsername={username} />
            <MemoizedMessageInput
                onSendMessage={(content) => handleSendMessageCallback.current(content)}
                disabled={loading}
            />
        </div>
    );
}