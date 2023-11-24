import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    // If the user is not logged in, throw error 401
    if (!userId) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // If the name parameter is not passed, throw error 400
    if (!name) {
      return new NextResponse("Parâmetro 'name' obrigatório!", { status: 400 });
    }

    // Creates a entry in the 'Stores' table of the database
    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    // TODO: Stop using console.log and switch to a logging service
    console.log("[STORES_POST]: ", error);
    // If something goes wrong, throw error 500
    return new NextResponse("Internal error", { status: 500 });
  }
}
