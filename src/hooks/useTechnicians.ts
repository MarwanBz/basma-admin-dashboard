import { getTechnicians } from "@/apis/technicians";
import { useQuery } from "@tanstack/react-query";

export function useTechnicians() {
  return useQuery({
    queryKey: ["technicians"],
    queryFn: getTechnicians,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
