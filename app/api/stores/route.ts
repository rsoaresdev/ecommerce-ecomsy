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
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // If the name parameter is not passed, throw error 400
    if (!name) {
      return new NextResponse("name is required!", { status: 400 });
    }

    // If the user has 10 or more stores, throw error 403
    const userStoresLength = await prismadb.store.count({
      where: {
        userId,
      },
    });

    // ? 403 - Forbidden
    if (userStoresLength >= 10) {
      return new NextResponse("Maximum number of stores reached (10)", {
        status: 403,
      });
    }

    // If the user has a store with the same name throw error 409
    const existingStore = await prismadb.store.findFirst({
      where: {
        name,
      },
    });

    // ? 409 - Conflict
    // ? Request cannot be completed due to a conflict with the current state of the resource.
    if (existingStore) {
      return new NextResponse(
        "It's not possible to create a store with the same name as one you already have!",
        { status: 409 }
      );
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
