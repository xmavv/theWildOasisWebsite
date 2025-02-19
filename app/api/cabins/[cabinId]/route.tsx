import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

//need to name like this
export async function GET(request, { params }) {
  const { cabinId } = params;
  // as a params from url

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch {
    return Response.json({ message: "cabin not found!" });
  }

  return Response.json({ test: "test" });
}

// export async function POST() {}
