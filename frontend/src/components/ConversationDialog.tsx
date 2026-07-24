import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import { useUpdateInterestStatus } from "@/hooks/useInterests";
import { InterestStatus } from "@/lib/types";

interface Props {
  interestId: string | null;
  title: string;
  currentStatus?: InterestStatus;
  onClose: () => void;
}

const statusOptions: { value: InterestStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in-talks", label: "In Talks" },
  { value: "confirmed", label: "Confirmed" },
];

// Opens as a modal from either dashboard's inbox so organizers and sponsors
// can chat and move a deal through its pipeline stage without leaving the page.
const ConversationDialog = ({ interestId, title, currentStatus, onClose }: Props) => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, sendMessage, sending, notifyTyping, peerTyping } = useChat(interestId || undefined);
  const updateStatus = useUpdateInterestStatus();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <Dialog open={Boolean(interestId)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden flex flex-col h-[70vh]">
        <DialogHeader className="px-5 py-4 border-b border-border flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base">{title}</DialogTitle>
          {currentStatus && interestId && (
            <Select
              value={currentStatus}
              onValueChange={(v) => updateStatus.mutate({ id: interestId, status: v as InterestStatus })}
            >
              <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {statusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center mt-6">No messages yet — say hello.</p>
              )}
              {messages.map((msg) => {
                const mine = typeof msg.sender === "object" ? msg.sender._id === user?.id : msg.sender === user?.id;
                return (
                  <div key={msg._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      mine ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-muted-foreground rounded-bl-md"
                    }`}>
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${mine ? "text-primary-foreground/60" : "text-muted-foreground/60"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {peerTyping && <p className="text-xs text-muted-foreground">Typing…</p>}
              <div ref={chatEndRef} />
            </div>
            <div className="px-4 py-3 border-t border-border flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  notifyTyping(true);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button size="icon" onClick={handleSend} disabled={!input.trim() || sending} className="shrink-0">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConversationDialog;
