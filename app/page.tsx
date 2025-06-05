import CreateDoc from "@/components/create-doc";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {redirect("/register")}

    return (
      <CreateDoc />
    )
}