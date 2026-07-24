import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";
import { EventRecord } from "@/lib/types";

export interface EventFilters {
  search?: string;
  category?: string;
  location?: string;
}

export const useEvents = (filters: EventFilters = {}) =>
  useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      const { data } = await api.get<{ events: EventRecord[] }>("/events", { params: filters });
      return data.events;
    },
  });

export const useEvent = (id: string | undefined) =>
  useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data } = await api.get<{ event: EventRecord }>(`/events/${id}`);
      return data.event;
    },
    enabled: Boolean(id),
  });

export const useMyEvents = (enabled: boolean) =>
  useQuery({
    queryKey: ["events", "mine"],
    queryFn: async () => {
      const { data } = await api.get<{ events: EventRecord[] }>("/events/mine");
      return data.events;
    },
    enabled,
  });

export interface CreateEventInput {
  name: string;
  college: string;
  location: string;
  date: string;
  attendees?: string;
  category: string;
  budget?: string;
  description?: string;
  images?: string[];
  stallTypes?: string[];
  sponsorsRequired?: string[];
  highlights?: string[];
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEventInput) => {
      try {
        const { data } = await api.post<{ event: EventRecord }>("/events", input);
        return data.event;
      } catch (err) {
        throw new Error(getErrorMessage(err, "Could not create event"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
