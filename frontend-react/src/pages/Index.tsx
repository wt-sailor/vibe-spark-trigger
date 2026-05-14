import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useVibeNotifications } from "@/hooks/use-vibe-notifications";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Index() {
  const {
    isRegistered,
    userId,
    isRegistering,
    messages,
    register,
    unregister,
  } = useVibeNotifications();
  const [inputUserId, setInputUserId] = useState("demo-user-1");
  const [notifTitle, setNotifTitle] = useState("Hello from Vibe! 🎉");
  const [notifBody, setNotifBody] = useState(
    "This is a test push notification.",
  );
  const [targetUsers, setTargetUsers] = useState("");
  const [isSilent, setIsSilent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSilentAlert, setShowSilentAlert] = useState(false);
  const alertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Effect to handle silent notification alert (5 seconds)
  useEffect(() => {
    if (messages.length > 0 && messages[0].type === "silent") {
      setShowSilentAlert(true);
      if (alertTimerRef.current) {
        clearTimeout(alertTimerRef.current);
      }
      alertTimerRef.current = setTimeout(() => {
        setShowSilentAlert(false);
        alertTimerRef.current = null;
      }, 5000);
    }
  }, [messages]);

  const handleSendNotification = async () => {
    setIsSending(true);
    try {
      const response = await fetch(`${API_URL}/api/send-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: notifTitle,
          body: notifBody,
          silent: isSilent,
          externalUsers: targetUsers.trim()
            ? targetUsers.split(",").map((u) => u.trim())
            : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      await response.json();
      toast.success(
        isSilent ? "Silent notification sent!" : "Notification sent!",
      );
    } catch (error) {
      toast.error("Failed to send: " + (error as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
            <span className={`text-3xl ${showSilentAlert && "animate-bounce"}`}>
              🔔
            </span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl font-bold text-white">Vibe Message Demo</h1>
          </div>
          <p className="mt-2 text-gray-300">
            Register a device, then trigger push notifications in real time.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Register */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-2">
              📱 Step 1 — Register Device
            </h2>
            <p className="text-gray-400 mb-4">
              Subscribe this browser to receive push notifications.
            </p>
            {!isRegistered ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter a user ID (e.g. demo-user-1)"
                  value={inputUserId}
                  onChange={(e) => setInputUserId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && register(inputUserId)}
                  className="flex-1 rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => register(inputUserId)}
                  disabled={isRegistering}
                  className="rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 text-white font-medium transition"
                >
                  {isRegistering ? "Registering…" : "Register"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-700 rounded p-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-green-600 text-white px-2 py-1 text-xs rounded font-medium">
                    ✓ Subscribed
                  </span>
                  <span className="text-gray-300">
                    as <strong>{userId}</strong>
                  </span>
                </div>
                <button
                  onClick={unregister}
                  className="rounded border border-gray-500 hover:border-gray-400 bg-gray-700 hover:bg-gray-600 px-3 py-1 text-sm text-gray-300 transition"
                >
                  Unregister
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Send */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-2">
              ⚡ Step 2 — Send Notification
            </h2>
            <p className="text-gray-400 mb-4">
              Trigger a push notification via the backend API.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="silent-toggle"
                  checked={isSilent}
                  onChange={(e) => setIsSilent(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="silent-toggle"
                  className="text-sm font-medium text-gray-300"
                >
                  Silent Notification (No visual alert, UI update only)
                </label>
              </div>

              {!isSilent && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {isSilent ? "Silent Data (Body)" : "Body"}
                </label>
                <input
                  type="text"
                  value={notifBody}
                  onChange={(e) => setNotifBody(e.target.value)}
                  placeholder={
                    isSilent ? "Enter data here..." : "Enter message body..."
                  }
                  className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Target Users{" "}
                  <span className="text-gray-500 text-xs">
                    (comma-separated, leave blank to broadcast)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="user-1, user-2"
                  value={targetUsers}
                  onChange={(e) => setTargetUsers(e.target.value)}
                  className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleSendNotification}
                disabled={isSending}
                className="w-full rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 text-white font-medium transition"
              >
                {isSending
                  ? "⏳ Sending…"
                  : isSilent
                    ? "📤 Send Silent Update"
                    : "📤 Send Notification"}
              </button>
            </div>
          </div>

          {/* Message Log */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-2">
              💬 Message Log
            </h2>
            <p className="text-gray-400 mb-4">
              Incoming notifications appear here in real time.
            </p>
            {messages.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                No messages yet. Register a device and send a notification!
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className="border border-gray-700 rounded p-3 bg-gray-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block bg-gray-600 text-gray-100 px-2 py-0.5 text-xs rounded font-medium mb-1">
                          {msg.type}
                        </span>
                        <pre className="mt-1 whitespace-pre-wrap text-xs text-gray-300 font-mono">
                          {JSON.stringify(msg.payload, null, 2)}
                        </pre>
                      </div>
                      <span className="shrink-0 text-xs text-gray-500">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
