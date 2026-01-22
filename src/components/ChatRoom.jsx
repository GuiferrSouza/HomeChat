import { useState, useEffect, useRef, memo } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { supabase, getMessages, createMessage } from '../services/api';

const MemoizedMessageInput = memo(MessageInput);

export default function ChatRoom({ room, username, onOpenRooms }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const lastMessageIdRef = useRef(null);
    const subscriptionRef = useRef(null);

    const loadMessages = async () => {
        if (!room) return;
        setLoading(true);
        setError(null);

        try {
            const data = await getMessages(room.id);
            const sorted = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            setMessages(sorted);
            if (sorted.length > 0) {
                lastMessageIdRef.current = sorted[sorted.length - 1].id;
            }
        } catch (err) {
            console.error(err);
            setError('Error loading messages');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (content) => {
        try {
            await createMessage(room.id, username, content);
        } catch (err) {
            console.error(err);
            alert('Error sending message');
        }
    };

    useEffect(() => {
        if (!room) return;

        loadMessages();

        if (subscriptionRef.current) {
            supabase.removeChannel(subscriptionRef.current);
        }

        const channel = supabase
            .channel(`messages_room_${room.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `room_id=eq.${room.id}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                    lastMessageIdRef.current = payload.new.id;
                }
            )
            .subscribe();

        subscriptionRef.current = channel;

        return () => {
            if (subscriptionRef.current) {
                supabase.removeChannel(subscriptionRef.current);
            }
        };
    }, [room]);

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