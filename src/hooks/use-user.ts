import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useUser() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();

      return data.user;
    },
  });

  useEffect(() => {
    if (!user) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      queryClient.setQueryData(["user"], session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, queryClient, user]);

  return { user, isLoading };
}

