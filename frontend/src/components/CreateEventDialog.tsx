import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateEvent } from "@/hooks/useEvents";
import { toast } from "@/hooks/use-toast";
import TagInput from "@/components/TagInput";
import ImageUploadInput from "@/components/ImageUploadInput";

const categories = ["Tech", "Cultural", "Business", "Sports", "Other"];

const emptyForm = {
  name: "",
  college: "",
  location: "",
  date: "",
  attendees: "",
  category: "Tech",
  budget: "",
  description: "",
  highlights: [] as string[],
  stallTypes: [] as string[],
  sponsorsRequired: [] as string[],
  images: [] as string[],
};

const CreateEventDialog = () => {
  const [open, setOpen] = useState(false);
  const createEvent = useCreateEvent();
  const [form, setForm] = useState(emptyForm);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canSubmit = form.name && form.college && form.location && form.date;

  const handleSubmit = () => {
    createEvent.mutate(form, {
      onSuccess: () => {
        toast({ title: "Event listed!", description: `${form.name} is now live for sponsors to discover.` });
        setOpen(false);
        setForm(emptyForm);
      },
      onError: (err) => {
        toast({ title: "Couldn't list event", description: err.message, variant: "destructive" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" className="gap-2">
          <Plus className="w-4 h-4" /> List a new event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>List a new event</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-name">Event name</Label>
              <Input id="ev-name" value={form.name} onChange={update("name")} placeholder="TechFest 2026" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-college">College / Organization</Label>
              <Input id="ev-college" value={form.college} onChange={update("college")} placeholder="IIT Bombay" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-location">Location</Label>
              <Input id="ev-location" value={form.location} onChange={update("location")} placeholder="Mumbai" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-date">Dates</Label>
              <Input id="ev-date" value={form.date} onChange={update("date")} placeholder="Apr 15–17, 2026" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-attendees">Expected footfall</Label>
              <Input id="ev-attendees" value={form.attendees} onChange={update("attendees")} placeholder="15,000+" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-budget">Sponsorship budget range</Label>
            <Input id="ev-budget" value={form.budget} onChange={update("budget")} placeholder="₹2L – ₹10L" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-desc">Description</Label>
            <Textarea id="ev-desc" value={form.description} onChange={update("description")} rows={4} placeholder="Tell sponsors what makes this event worth backing..." />
          </div>

          <div className="space-y-1.5">
            <Label>Highlights</Label>
            <TagInput
              value={form.highlights}
              onChange={(v) => setForm((p) => ({ ...p, highlights: v }))}
              placeholder="e.g. 3-day event, Celebrity keynotes…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Types of stalls</Label>
            <TagInput
              value={form.stallTypes}
              onChange={(v) => setForm((p) => ({ ...p, stallTypes: v }))}
              placeholder="e.g. Food Court, Gaming Zone…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Sponsors required</Label>
            <TagInput
              value={form.sponsorsRequired}
              onChange={(v) => setForm((p) => ({ ...p, sponsorsRequired: v }))}
              placeholder="e.g. Title Sponsor, Food Partner…"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Event photos</Label>
            <ImageUploadInput
              value={form.images}
              onChange={(v) => setForm((p) => ({ ...p, images: v }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="hero" disabled={!canSubmit || createEvent.isPending} onClick={handleSubmit} className="gap-2">
            {createEvent.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Publish Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;