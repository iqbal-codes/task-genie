"use client";
import { useActionState } from "react";
import { useUser } from "./use-user";

export type ActionStateWithUser = {
  userId: string;
  [key: string]: string | number | boolean | undefined | null;
};

export function useActionStateWithUser<State, Payload>(
  action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State>
) {
  const { user } = useUser();
  const [state, baseAction, pending] = useActionState(
    (state: Awaited<State>, payload: Payload) => {
      if (!user?.id) throw new Error("Unauthorized");
      return action({ ...state, userId: user?.id }, payload);
    },
    initialState
  );

  return [state, baseAction, pending] as const;
}

