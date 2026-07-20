import { useEffect, useState } from 'react';
import './App.css';

import UsernameScreen from './components/UsernameScreen';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import ErrorMessage from './components/ErrorMessage';
import Loading from './components/Loading';
import UserInfo from './components/UserInfo';

import { useRoomsData } from './hooks/useRoomsData';
import { getAccessLocation } from './services/access';
import { registerAccess } from './services/supabase';
import { notifyAccess } from './services/telegram';

export default function App() {
    const { data, loading, error } = useRoomsData();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [username, setUsername] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const handleAccess = async () => {
            const location = await getAccessLocation();
            await registerAccess(location);
            await notifyAccess(location);
        };
        handleAccess();
    }, []);

    const handleUsernameSubmit = (submittedUsername) => {
        setUsername(submittedUsername);
        setIsUsernameSet(true);
    };

    const handleLogout = () => {
        setUsername('');
        setIsUsernameSet(false);
        setSelectedRoom(null);
    };

    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
        setIsSidebarOpen(false);
    };

    if (!isUsernameSet) return <UsernameScreen onSubmit={handleUsernameSubmit} />;
    if (error) return <ErrorMessage message="Error loading data" onRetry={() => window.location.reload()} />;

    return (
        <div className="app">
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <UserInfo username={username} onLogout={handleLogout} />
                {loading ? (
                    <Loading />
                ) : (
                    <RoomList rooms={data} selectedRoom={selectedRoom} onSelectRoom={handleSelectRoom} />
                )}
            </aside>
            <main className="main-content">
                <ChatRoom room={selectedRoom} username={username} onOpenRooms={() => setIsSidebarOpen(true)} />
            </main>
        </div>
    );
}