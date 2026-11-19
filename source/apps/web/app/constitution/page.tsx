import { redirect } from "next/navigation";

/** The old address; every legal instrument now lives under `/law`. */
export default function Page(): never {
  redirect("/law");
}
