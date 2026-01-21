import { useState, useEffect } from 'react';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import { getRooms } from './services/api';
import './App.css';

function App() {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [username, setUsername] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const loadRooms = async () => {
        try {
            const data = await getRooms();
            setRooms(data);
        } catch (err) {
            console.error('Error loading rooms:', err);
            alert('Error connecting to the server.');
        }
    };

    useEffect(() => {
        if (isUsernameSet) {
            loadRooms();
        }
    }, [isUsernameSet]);

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (username.trim().length >= 3) {
            setIsUsernameSet(true);
        }
    };

    if (!isUsernameSet) {
        return (
            <div className="username-screen">
                <div className="username-container">
                    <h1>HomeChat</h1>
                    <p>Welcome! Choose your username to get started.</p>
                    <form onSubmit={handleUsernameSubmit}>
                        <input
                            type="text"
                            placeholder="Your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            maxLength={50}
                            minLength={3}
                            required
                            autoFocus
                        />
                        <button type="submit" disabled={username.trim().length < 3}>
                            Enter
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="user-info">
                    <span>👤 {username}</span>
                    <button onClick={() => setIsUsernameSet(false)} className="logout-btn">
                        Exit
                    </button>
                </div>
                <RoomList
                    rooms={rooms}
                    selectedRoom={selectedRoom}
                    onSelectRoom={(room) => {
                        setSelectedRoom(room);
                        setIsSidebarOpen(false);
                    }}
                />
            </aside>
            <main className="main-content">
                <ChatRoom
                    room={selectedRoom}
                    username={username}
                    onOpenRooms={() => setIsSidebarOpen(true)}
                />
            </main>
        </div>
    );
}

export default App;