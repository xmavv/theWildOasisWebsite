"use server";

import { signIn, signOut } from "./auth";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  //to jest tez ten middleware tzn jezeli sie powiedzie ta funkcja to idz wtedy do / url
  await signOut({ redirectTo: "/" });
}
