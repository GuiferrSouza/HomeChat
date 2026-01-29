export default function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-container">
            <div className="error-content">
                <div className="error-icon">⚠</div>
                <h2 className="error-title">Oops! Something went wrong</h2>
                <p className="error-message">{message}</p>
                {onRetry && (
                    <button className="error-retry-btn" onClick={onRetry}>
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}