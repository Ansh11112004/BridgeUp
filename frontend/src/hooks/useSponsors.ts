import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";
import { SponsorProfileRecord } from "@/lib/types";

export interface SponsorFilters {
  search?: string;
  category?: string;
  location?: string;
}

export const useSponsors = (filters: SponsorFilters = {}) =>
  useQuery({
    queryKey: ["sponsors", filters],
    queryFn: async () => {
      const { data } = await api.get<{ sponsors: SponsorProfileRecord[] }>("/sponsors", {
        params: filters,
      });
      return data.sponsors;
    },
  });

export const useSponsor = (id: string | undefined) =>
  useQuery({
    queryKey: ["sponsor", id],
    queryFn: async () => {
      const { data } = await api.get<{ sponsor: SponsorProfileRecord }>(`/sponsors/${id}`);
      return data.sponsor;
    },
    enabled: Boolean(id),
  });

export const useMySponsorProfile = (enabled: boolean) =>
  useQuery({
    queryKey: ["sponsors", "me"],
    queryFn: async () => {
      const { data } = await api.get<{ profile: SponsorProfileRecord | null }>("/sponsors/me");
      return data.profile;
    },
    enabled,
  });

export interface UpsertSponsorProfileInput {
  name: string;
  category?: string;
  location?: string;
  budget?: string;
  description?: string;
  interests?: string[];
  images?: string[];
}

export const useUpsertSponsorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpsertSponsorProfileInput) => {
      try {
        const { data } = await api.post<{ profile: SponsorProfileRecord }>("/sponsors", input);
        return data.profile;
      } catch (err) {
        throw new Error(getErrorMessage(err, "Could not save sponsor profile"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
    },
  });
};
