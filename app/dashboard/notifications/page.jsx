"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Bell, CheckCircle, RotateCw } from "lucide-react";
import { format } from "date-fns";
import { se } from "date-fns/locale";

function NotificationPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/notifications?userId=${session?.user?.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
    }
  }, [session?.user?.id]);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      setNotifications(
        notifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`/api/notifications/read-all`, {
        method: "POST",
        headers: {
          "Content-Type": "applicayion/json",
        },
        body: JSON.stringify({ userId: session?.user?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notification as read");
      }
      setNotifications(
        notifications.map((notification) => ({ ...notification, read: true }))
      );

      toast.success("All notfications marked as read");
    } catch (error) {
      console.error("Error marking all notification as read:", error);
      toast.error("Failed to update notification");
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
            <p className="text-muted-foreground">
              Stay updated with alerts about your containers.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchNotifications}>
              <RotateCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardHeader>
              <div className="h-7 bg-muted animate-pulse rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <div className="h-5 bg-muted animate-pulse rounded w-3/4"></div>
                      <div className="h-5 bg-muted animate-pulse rounded w-1/5"></div>
                    </div>
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2 mb-4"></div>
                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
              <p className="text-muted-foreground">
                You don't have any notifications at the moment. When containers
                run low, you'll see alerts here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification._id} className="relative">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex items-start space-x-4">
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-primary mt-2"></span>
                        )}
                        <div className={notification.read ? "ml-6" : ""}>
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              new Date(notification.createdAt),
                              "MMM dd, yyyy - h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification._id)}
                          className="self-start"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };
}
export default NotificationPage;
