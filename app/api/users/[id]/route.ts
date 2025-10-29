import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { verifyToken } from "@/utils/auth";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const cookieStore = cookies();
    const token = (await cookieStore).get(config.session.cookieName)?.value;

    if (!token) {
      return NextResponse.json({ error: "Please log in" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const user = await users.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   request: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await context.params;

//     const cookieStore = cookies();
//     const token = (await cookieStore).get(config.session.cookieName)?.value;

//     if (!token) {
//       return NextResponse.json({ error: "Please log in" }, { status: 401 });
//     }

//     const decoded = await verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }

//     await connectDB();

//     const userId = id;
//     const requesterId = decoded.id;
//     const isAdmin = decoded.role === "admin";

//     if (userId !== requesterId && !isAdmin) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//     }

//     const body = await request.json();

//     // Disallow password change
//     delete body.password;

//     const updatedUser = await users
//       .findByIdAndUpdate(userId, { $set: body }, { new: true })
//       .select("-password");

//     if (!updatedUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(updatedUser, { status: 200 });
//   } catch (error) {
//     console.error("PATCH /api/users/[id] error:", error);
//     return NextResponse.json(
//       { error: "Failed to update user" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const cookieStore = cookies();
//     const token = (await cookieStore).get(config.session.cookieName)?.value;

//     if (!token) {
//       return NextResponse.json({ error: "Please log in" }, { status: 401 });
//     }

//     const decoded = await verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }

//     await connectDB();

//     const userId = params.id;
//     const requesterId = decoded.id;
//     const isAdmin = decoded.role === "admin";

//     if (userId !== requesterId && !isAdmin) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//     }

//     const deletedUser = await users.findByIdAndDelete(userId);

//     if (!deletedUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       { message: "User deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("DELETE /api/users/[id] error:", error);
//     return NextResponse.json(
//       { error: "Failed to delete user" },
//       { status: 500 }
//     );
//   }
// }
