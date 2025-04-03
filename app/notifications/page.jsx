"use client";

import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { FiBell, FiCheck, FiTrash2 } from "react-icons/fi";

function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.householdId) {
            fetchNotifications();

            // Auto-fetch every 30 seconds for real-time updates
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/notifications?householdId=${user.householdId}&memberId=${user._id}`);

            if (!res.ok) {
                throw new Error("Failed to load notifications");
            }

            const data = await res.json();
            console.log("Fetched Notifications:", data);
            setNotifications(data);
        } catch (error) {
            setError(error.message);
            console.error("Fetch notifications error:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const res = await fetch("/api/notifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId }),
            });

            if (!res.ok) {
                throw new Error("Failed to update notification");
            }

            const updatedNotification = await res.json();
            setNotifications((prev) =>
                prev.map((n) => (n._id === notificationId ? updatedNotification : n))
            );
        } catch (error) {
            setError(error.message);
            console.error("Mark as read error:", error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const res = await fetch(`/api/notifications?notificationId=${notificationId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete notification");
            }

            setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        } catch (error) {
            setError(error.message);
            console.error("Delete notification error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FiBell className="mr-2" /> Notifications
                </h1>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {notifications.length === 0 ? (
                <EmptyState
                    title="No Notifications"
                    description="You don't have any notifications yet"
                    icon={<FiBell size={48} className="text-gray-400" />}
                />
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-4 border rounded-lg ${
                                notification.isRead ? "bg-white" : "bg-blue-50 border-blue-200"
                            }`}
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium">{notification.message}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>

                                    {notification.metadata && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            <span className="font-semibold">Product ID:</span>{" "}
                                            {notification.metadata.productId || "N/A"} <br />
                                            <span className="font-semibold">Current Weight:</span>{" "}
                                            {notification.metadata.currentWeight
                                                ? parseFloat(notification.metadata.currentWeight).toFixed(2)
                                                : "N/A"}{" "}
                                            {notification.metadata.unit || ""}
                                        </div>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    {!notification.isRead && (
                                        <button
                                            onClick={() => markAsRead(notification._id)}
                                            className="text-green-600 hover:text-green-800"
                                            title="Mark as read"
                                        >
                                            <FiCheck />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification._id)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NotificationsPage;
