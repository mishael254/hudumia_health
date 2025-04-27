import React, { useEffect } from 'react';

const Notification = ({ notification, setNotification }) => {
  useEffect(() => {
    if (notification.show) {
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  if (!notification.show) return null;

  return (
    <div className="notification-container">
      <div className={`notification ${notification.type}`}>
        {notification.message}
      </div>
    </div>
  );
};

export default Notification;
