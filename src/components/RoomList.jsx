import { MessageSquare } from 'lucide-react';

export default function RoomList({ rooms, selectedRoom, onSelectRoom }) {
    return (
        <div className="room-list">
            <div className="room-list-header">
                <h2>Rooms</h2>
            </div>

            <div className="rooms">
                {rooms.length === 0 ? (
                    <p className="no-rooms">No rooms available</p>
                ) : (
                    rooms.map((room) => (
                        <div key={room.id}
                            className={`room-item ${selectedRoom?.id === room.id ? 'active' : ''}`}
                            onClick={() => onSelectRoom(room)}
                        >
                            <MessageSquare size={20} />
                            <span className="room-name">{room.name}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}