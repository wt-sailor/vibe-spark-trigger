import { useState } from 'react';
import { Bell, Send, UserPlus, UserMinus, Zap, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useVibeNotifications } from '@/hooks/use-vibe-notifications';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Index = () => {
  const { isRegistered, userId, isRegistering, messages, register, unregister } = useVibeNotifications();
  const [inputUserId, setInputUserId] = useState('demo-user-1');
  const [notifTitle, setNotifTitle] = useState('Hello from Vibe! 🎉');
  const [notifBody, setNotifBody] = useState('This is a test push notification.');
  const [targetUsers, setTargetUsers] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendNotification = async () => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: {
          title: notifTitle,
          body: notifBody,
          externalUsers: targetUsers.trim()
            ? targetUsers.split(',').map(u => u.trim())
            : undefined,
        },
      });
      if (error) throw error;
      toast.success('Notification sent!', { description: JSON.stringify(data) });
    } catch (error) {
      toast.error('Failed to send: ' + (error as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Bell className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Vibe Message Demo
          </h1>
          <p className="mt-2 text-muted-foreground">
            Register a device, then trigger push notifications in real time.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Register */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Step 1 — Register Device
              </CardTitle>
              <CardDescription>
                Subscribe this browser to receive push notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isRegistered ? (
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter a user ID (e.g. demo-user-1)"
                    value={inputUserId}
                    onChange={e => setInputUserId(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && register(inputUserId)}
                  />
                  <Button onClick={() => register(inputUserId)} disabled={isRegistering}>
                    {isRegistering ? 'Registering…' : 'Register'}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">
                      Subscribed
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      as <strong>{userId}</strong>
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={unregister}>
                    <UserMinus className="mr-1.5 h-4 w-4" />
                    Unregister
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Send */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Step 2 — Send Notification
              </CardTitle>
              <CardDescription>
                Trigger a push notification via the server SDK (edge function).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Title</label>
                  <Input
                    value={notifTitle}
                    onChange={e => setNotifTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Body</label>
                  <Input
                    value={notifBody}
                    onChange={e => setNotifBody(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Target Users <span className="text-muted-foreground">(comma-separated, leave blank to broadcast)</span>
                </label>
                <Input
                  placeholder="user-1, user-2"
                  value={targetUsers}
                  onChange={e => setTargetUsers(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleSendNotification} disabled={isSending}>
                <Zap className="mr-2 h-4 w-4" />
                {isSending ? 'Sending…' : 'Send Notification'}
              </Button>
            </CardContent>
          </Card>

          {/* Message Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Message Log
              </CardTitle>
              <CardDescription>
                Incoming notifications appear here in real time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No messages yet. Register a device and send a notification!
                </p>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i}>
                      {i > 0 && <Separator className="mb-3" />}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge variant="secondary" className="mb-1 text-xs">
                            {msg.type}
                          </Badge>
                          <pre className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">
                            {JSON.stringify(msg.payload, null, 2)}
                          </pre>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
