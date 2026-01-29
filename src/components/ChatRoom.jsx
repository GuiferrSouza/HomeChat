import { useEffect, useRef, memo } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Loading from './Loading';
import { supabase, createMessage } from '../services/supabase';
import { useMessagesData } from '../hooks/useMessagesData';

const MemoizedMessageInput = memo(MessageInput);

export default function ChatRoom({ room, username, onOpenRooms }) {
    const { data, setData, loading, error } = useMessagesData(room?.id);
    const lastMessageIdRef = useRef(null);
    const subscriptionRef = useRef(null);

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
                    setData(prev => [...prev, payload.new]);
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
            {loading ? (<Loading />) : (
                <MessageList messages={data} currentUsername={username} />
            )}
            <MemoizedMessageInput
                onSendMessage={(content) => handleSendMessageCallback.current(content)}
                disabled={loading}
            />
        </div>
    );
}