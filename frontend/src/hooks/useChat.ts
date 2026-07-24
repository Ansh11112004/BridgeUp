import { useCallback, useEffect, useRef, useState } from "react";
import { api, getErrorMessage } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { MessageRecord } from "@/lib/types";

// Loads chat history over REST, then keeps it live via a Socket.io room.
// Falls back to REST POST for sending if the socket round-trip errors out.
export const useChat = (interestId: string | undefined) => {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!interestId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<{ messages: MessageRecord[] }>(
          `/interests/${interestId}/messages`
        );
        if (!cancelled) setMessages(data.messages);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not load messages"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();

    const socket = getSocket();
    socket.emit("join_conversation", interestId);

    const onNewMessage = (message: MessageRecord) => {
      if (message.interest === interestId) {
        setMessages((prev) => (prev.some((m) => m._id === message._id) ? prev : [...prev, message]));
      }
    };
    const onTyping = ({ isTyping }: { userId: string; isTyping: boolean }) => {
      setPeerTyping(isTyping);
    };

    socket.on("new_message", onNewMessage);
    socket.on("typing", onTyping);

    return () => {
      cancelled = true;
      socket.emit("leave_conversation", interestId);
      socket.off("new_message", onNewMessage);
      socket.off("typing", onTyping);
    };
  }, [interestId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!interestId || !text.trim()) return;
      setSending(true);
      try {
        const socket = getSocket();
        const ack = await new Promise<{ ok: boolean; message?: MessageRecord; error?: string }>(
          (resolve) => {
            socket.emit("send_message", { interestId, text }, resolve);
            // If the socket doesn't ack quickly (e.g. still connecting), fall back to REST
            setTimeout(() => resolve({ ok: false, error: "timeout" }), 4000);
          }
        );

        if (!ack.ok) {
          const { data } = await api.post<{ message: MessageRecord }>(
            `/interests/${interestId}/messages`,
            { text }
          );
          setMessages((prev) =>
            prev.some((m) => m._id === data.message._id) ? prev : [...prev, data.message]
          );
        }
      } catch (err) {
        setError(getErrorMessage(err, "Could not send message"));
      } finally {
        setSending(false);
      }
    },
    [interestId]
  );

  const notifyTyping = useCallback(
    (isTyping: boolean) => {
      if (!interestId) return;
      const socket = getSocket();
      socket.emit("typing", { interestId, isTyping });
      if (isTyping) {
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => socket.emit("typing", { interestId, isTyping: false }), 3000);
      }
    },
    [interestId]
  );

  return { messages, loading, error, sending, sendMessage, peerTyping, notifyTyping };
};
