import { useState } from 'react';

export default function UsernameScreen({ onSubmit }) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim().length >= 3) {
            onSubmit(username.trim());
        }
    };

    return (
        <div className="username-screen">
            <div className="username-container">
                <h1>HomeChat</h1>
                <p>Welcome! Choose your username to get started.</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Your username"
                        value={username} onChange={(e) => setUsername(e.target.value)}
                        maxLength={50} minLength={3} required autoFocus
                    />
                    <button type="submit" disabled={username.trim().length < 3}>
                        Enter
                    </button>
                </form>
            </div>
        </div>
    );
}