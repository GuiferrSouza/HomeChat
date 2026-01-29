export default function UserInfo({ username, onLogout }) {
    return (
        <div className="user-info">
            <span>👤 {username}</span>
            <button onClick={onLogout} className="logout-btn">
                Exit
            </button>
        </div>
    );
}