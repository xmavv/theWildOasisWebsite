"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";

export async function updateGuest(formData: FormData) {
  const session = await auth();

  //will be caught be the error boundary
  if (!session) throw new Error("You must be logged in!");

  const nationalID = formData.get("nationalID")?.toString();
  const [nationality, countryFlag] =
    formData.get("nationality")?.toString().split("%") ?? [];

  if (!nationalID?.match(/^[a-zA-Z0-9]{6,12}$/))
    throw new Error("Please provide a valid nationalID");

  const updateData = { nationality, countryFlag, nationalId: nationalID };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user?.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  //to jest tez ten middleware tzn jezeli sie powiedzie ta funkcja to idz wtedy do / url
  await signOut({ redirectTo: "/" });
}
