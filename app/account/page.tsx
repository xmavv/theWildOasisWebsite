import { auth } from "../_lib/auth";

export const metadata = { title: "Account" };

export default async function Page() {
  const session = await auth();
  const firstname = session?.user.name.split(" ").at(0);

  console.log(session);

  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {firstname}
    </h2>
  );
}
