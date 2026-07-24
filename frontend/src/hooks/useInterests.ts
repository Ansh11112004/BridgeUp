import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";
import { InterestRecord, InterestStatus } from "@/lib/types";

export const useMyInterests = (enabled: boolean) =>
  useQuery({
    queryKey: ["interests", "mine"],
    queryFn: async () => {
      const { data } = await api.get<{ interests: InterestRecord[] }>("/interests/mine");
      return data.interests;
    },
    enabled,
    refetchInterval: 15000, // light polling as a fallback alongside socket pushes
  });

export const useInterest = (id: string | undefined) =>
  useQuery({
    queryKey: ["interest", id],
    queryFn: async () => {
      const { data } = await api.get<{ interest: InterestRecord }>(`/interests/${id}`);
      return data.interest;
    },
    enabled: Boolean(id),
  });

export interface CreateInterestInput {
  eventId: string;
  sponsorId?: string; // required when an organizer initiates
  message?: string;
  amount?: string;
}

export const useCreateInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateInterestInput) => {
      try {
        const { data } = await api.post<{ interest: InterestRecord }>("/interests", input);
        return data.interest;
      } catch (err) {
        throw new Error(getErrorMessage(err, "Could not send request"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interests"] });
    },
  });
};

export const useUpdateInterestStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: InterestStatus }) => {
      try {
        const { data } = await api.patch<{ interest: InterestRecord }>(`/interests/${id}/status`, {
          status,
        });
        return data.interest;
      } catch (err) {
        throw new Error(getErrorMessage(err, "Could not update status"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interests"] });
    },
  });
};
