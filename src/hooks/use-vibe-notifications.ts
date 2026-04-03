import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { vibeClient } from "@/lib/vibe-client";

export function useVibeNotifications() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userId, setUserId] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ type: string; payload: unknown; time: string }>
  >([]);

  const register = useCallback(async (externalUserId: string) => {
    if (!externalUserId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }
    setIsRegistering(true);
    try {
      await vibeClient.registerDevice({
        externalUserId,
        serviceWorkerPath: "/push-sw.js",
        serviceWorkerScope: "/",
      });

      vibeClient.onMessage((payload: unknown) => {
        setMessages((prev) => [
          {
            type: "foreground",
            payload,
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
        const p = payload as { title?: string; body?: string };
        const message = [p?.title || "New notification", p?.body]
          .filter(Boolean)
          .join("\n");
        toast.info(message);
      });

      vibeClient.onBackgroundMessage((payload: unknown) => {
        setMessages((prev) => [
          {
            type: "background",
            payload,
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      });

      vibeClient.onSilentMessage((data: unknown) => {
        setMessages((prev) => [
          {
            type: "silent",
            payload: data,
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      });

      setUserId(externalUserId);
      setIsRegistered(true);
      toast.success("Device registered successfully!");
    } catch (error) {
      toast.error("Failed to register device: " + (error as Error).message);
    } finally {
      setIsRegistering(false);
    }
  }, []);

  const unregister = useCallback(async () => {
    try {
      await vibeClient.unregisterDevice(userId);

      // Unregister service worker and clear caches to ensure complete cleanup
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            await subscription.unsubscribe();
          }
          await registration.unregister();
        }
      }
      // clear caches (recommended)
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
      setIsRegistered(false);
      setUserId("");
      toast.success("Device unregistered");
    } catch (error) {
      toast.error("Failed to unregister: " + (error as Error).message);
    }
  }, [userId]);

  return {
    isRegistered,
    userId,
    isRegistering,
    messages,
    register,
    unregister,
  };
}
