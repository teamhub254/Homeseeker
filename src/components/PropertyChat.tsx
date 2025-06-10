import { useState, useEffect, useRef } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { Send, Loader2, User, Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    sender_name: string;
    sender_avatar?: string;
    is_read?: boolean;
}

interface PropertyChatProps {
    propertyId: string;
    inquiryId: string;
}

const PropertyChat = ({ propertyId, inquiryId }: PropertyChatProps) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [otherUserProfile, setOtherUserProfile] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inquiryId) {
            fetchMessages();
            fetchOtherUserProfile();
            const subscription = subscribeToMessages();
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [inquiryId]);

    const fetchOtherUserProfile = async () => {
        try {
            const { data: inquiryData, error: inquiryError } = await supabase
                .from('inquiries')
                .select('user_id')
                .eq('id', inquiryId)
                .single();

            if (inquiryError) throw inquiryError;

            if (inquiryData.user_id === user?.id) {
                const { data: propertyData, error: propertyError } = await supabase
                    .from('properties')
                    .select('user_id')
                    .eq('id', propertyId)
                    .single();

                if (propertyError) throw propertyError;

                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', propertyData.user_id)
                    .single();

                if (profileError) throw profileError;
                setOtherUserProfile(profileData);
            } else {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', inquiryData.user_id)
                    .single();

                if (profileError) throw profileError;
                setOtherUserProfile(profileData);
            }
        } catch (error) {
            console.error('Error fetching other user profile:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data: inquiryData, error: inquiryError } = await supabase
                .from('inquiries')
                .select('id, user_id')
                .eq('id', inquiryId)
                .single();

            if (inquiryError) {
                throw new Error('Inquiry not found or access denied');
            }

            const { data, error } = await supabase
                .from('chat_messages')
                .select(`
                    id,
                    content,
                    sender_id,
                    created_at,
                    is_read
                `)
                .eq('inquiry_id', inquiryId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const senderIds = [...new Set(data.map(msg => msg.sender_id))];
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('user_id, first_name, last_name, avatar_url')
                .in('user_id', senderIds);

            if (profilesError) throw profilesError;

            const profilesMap = new Map(
                profilesData.map(profile => [profile.user_id, profile])
            );

            const formattedMessages = data.map(msg => {
                const profile = profilesMap.get(msg.sender_id);
                return {
                    id: msg.id,
                    content: msg.content,
                    sender_id: msg.sender_id,
                    created_at: msg.created_at,
                    sender_name: profile ?
                        `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown' :
                        'Unknown',
                    sender_avatar: profile?.avatar_url,
                    is_read: msg.is_read
                };
            });

            setMessages(formattedMessages);
            scrollToBottom();

            // Mark messages as read if they were sent by the other user
            const unreadMessages = formattedMessages.filter(
                msg => msg.sender_id !== user?.id && !msg.is_read
            );

            if (unreadMessages.length > 0) {
                await supabase
                    .from('chat_messages')
                    .update({ is_read: true })
                    .in('id', unreadMessages.map(msg => msg.id));
            }
        } catch (error: any) {
            console.error('Error fetching messages:', error);
            setError(error.message || 'Failed to load messages. Please try again.');
            toast({
                title: "Error",
                description: error.message || "Failed to load messages. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const subscribeToMessages = () => {
        return supabase
            .channel(`chat_messages:${inquiryId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'chat_messages',
                filter: `inquiry_id=eq.${inquiryId}`
            }, async () => {
                await fetchMessages();
            })
            .subscribe();
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const newMessageObj = {
            id: Date.now().toString(), // Temporary ID
            inquiry_id: inquiryId,
            sender_id: user.id,
            content: newMessage.trim(),
            created_at: new Date().toISOString(),
            sender: {
                email: user.email,
                profile: {
                    first_name: user.user_metadata?.first_name || '',
                    last_name: user.user_metadata?.last_name || ''
                }
            }
        };

        // Optimistically add the message to the UI
        setMessages(prev => [...prev, newMessageObj]);
        setNewMessage('');

        try {
            const { error } = await supabase
                .from('inquiry_messages')
                .insert([
                    {
                        inquiry_id: inquiryId,
                        sender_id: user.id,
                        content: newMessageObj.content
                    }
                ]);

            if (error) throw error;
        } catch (error) {
            console.error('Error sending message:', error);
            // Remove the optimistic message if there was an error
            setMessages(prev => prev.filter(m => m.id !== newMessageObj.id));
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            });
        }
    };

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!user) {
        return (
            <div className="p-4 text-center text-nest-text-secondary">
                Please log in to view and send messages.
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-nest-text-primary">Property Chat</h3>
                </div>
                <div className="flex-1 p-4 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button
                            onClick={fetchMessages}
                            className="bg-nest-primary hover:bg-nest-primary/90"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b bg-gray-50 flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={otherUserProfile?.avatar_url} />
                    <AvatarFallback>
                        <User className="h-6 w-6" />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold text-nest-text-primary">
                        {otherUserProfile ?
                            `${otherUserProfile.first_name} ${otherUserProfile.last_name}` :
                            'Chat'
                        }
                    </h3>
                    <p className="text-sm text-nest-text-secondary">
                        {otherUserProfile?.email || 'No email'}
                    </p>
                </div>
            </div>

            <ScrollArea ref={scrollRef} className="flex-1 p-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-nest-primary" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-nest-text-secondary">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-end gap-2 ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                {message.sender_id !== user?.id && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={message.sender_avatar} />
                                        <AvatarFallback>
                                            <User className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={`max-w-[70%] rounded-2xl p-3 ${message.sender_id === user?.id
                                        ? 'bg-nest-primary text-white rounded-br-none'
                                        : 'bg-gray-100 text-nest-text-primary rounded-bl-none'
                                        }`}
                                >
                                    <div className="text-sm whitespace-pre-wrap break-words">
                                        {message.content}
                                    </div>
                                    <div className={`flex items-center justify-end gap-1 mt-1 ${message.sender_id === user?.id
                                        ? 'text-white/70'
                                        : 'text-nest-text-secondary'
                                        }`}>
                                        <span className="text-xs">
                                            {new Date(message.created_at).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                        {message.sender_id === user?.id && (
                                            <span className="text-xs">
                                                {message.is_read ? (
                                                    <CheckCheck className="h-3 w-3" />
                                                ) : (
                                                    <Check className="h-3 w-3" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {message.sender_id === user?.id && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                                        <AvatarFallback>
                                            <User className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
                <div className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-white text-nest-text-primary rounded-full"
                        disabled={sending}
                    />
                    <Button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="bg-nest-primary hover:bg-nest-primary/90 rounded-full h-10 w-10 p-0"
                    >
                        {sending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PropertyChat; 