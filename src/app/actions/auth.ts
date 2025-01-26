"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  FormValuesLoginWithEmailAndPassword,
  loginSchema,
} from "@/schema/auth";

export async function loginWithEmailAndPassword(
  _prevState: unknown,
  formData: FormData
) {
  const formDataObject = Object.fromEntries(formData);
  const { email, password } =
    formDataObject as FormValuesLoginWithEmailAndPassword;

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: "Invalid email or password format" };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

