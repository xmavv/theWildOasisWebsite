"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

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

export async function updateReservation(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in!");
  const guestId = Number(formData.get("guestId"));

  if (guestId !== session.user.guestId)
    throw new Error("You are not allowed to delete this booking!");

  const reservationId = Number(formData.get("bookingId"));
  const numGuests = Number(formData.get("numGuests")?.toString());
  const observations = formData.get("observations")?.toString().slice(0, 1000);

  const updatedData = { numGuests, observations };

  const { error } = await supabase
    .from("bookings")
    .update(updatedData)
    .eq("id", reservationId)
    .select()
    .single();

  if (error) throw new Error("Reservation could not be updated");

  revalidatePath("account/reservations");
  revalidatePath(`account/reservations/edit/${reservationId}`);
  redirect("account/reservations");
}

export async function deleteReservation(bookingId: number) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in!");

  // 2
  // prevention from deleting not users cabins
  // moze nie byc takie super bo wtedy w curl w data-raw bedzie przekazane to co podalismy do funkcji i wtedy ktos moglby sie domyslic albo bruteforcowac rozne id i rozne id cabin
  // if (guestId !== session.user.guestId)
  // throw new Error("You are not allowed to delete this booking!");

  // 1

  // const guestBookings = await getBookings(session.user.guestId);
  // const guestBookingsIds = guestBookings.map((booking) => booking.id);

  // // prevention from deleting not users cabins
  // if (!guestBookingsIds.includes(bookingId))
  //   throw new Error("You are not allowed to delete this booking!");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  // we give a tag from fetch function, and then we revalidate this specific tag
  // revalidateTag();
  revalidatePath("account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  //to jest tez ten middleware tzn jezeli sie powiedzie ta funkcja to idz wtedy do / url
  await signOut({ redirectTo: "/" });
}
