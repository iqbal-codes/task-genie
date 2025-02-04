import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient();

export function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // Try to get user from local DB first
      const localUsers = await db.users.toArray();
      if (localUsers.length > 0) {
        return localUsers[0];
      }

      // If not found locally, get from Supabase and store
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await db.users.put(user);
      }
      return user;
    },
  });

  // Listen for auth changes and update local DB
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        await db.users.put(session.user);
      } else {
        await db.users.clear();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
}
