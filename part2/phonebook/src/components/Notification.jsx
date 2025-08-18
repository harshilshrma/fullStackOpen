const Notification = ({ message, errorMessage }) => {
    if (message == null && errorMessage == null) {
        return null;
    }

    return (
        <div className={errorMessage ? "error" : "success"}>
            {message === null ? errorMessage : message}
        </div>
    )
}

export default Notification;