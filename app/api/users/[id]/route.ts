import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import users from "@/models/users";
import { authenticateUser } from "@/lib/authenticateUser";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { errorResponse } = await authenticateUser(["admin"]);

    if (errorResponse) return errorResponse;

    await connectDB();
    // const user = await users.findById(id).select("-password");

    const user = await users.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(id),
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "_id",
          foreignField: "members",
          as: "teams",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "members",
                foreignField: "_id",
                as: "members",
              },
            },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "teams._id",
          foreignField: "teams",
          as: "projects",
          pipeline: [
            {
              $lookup: {
                from: "teams",
                localField: "teams",
                foreignField: "_id",
                as: "teams",
                pipeline: [
                  // {
                  //   $lookup: {
                  //     from: "users",
                  //     localField: "members",
                  //     foreignField: "_id",
                  //     as: "members",
                  //     pipeline: [
                  //       {
                  //         $project: { name: 1, email: 1, role: 1, isActive: 1 },
                  //       },
                  //     ],
                  //   },
                  // },

                  { $project: { _id: 1, name: 1, description: 1 } },
                ],
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
                pipeline: [
                  {
                    $project: { name: 1, email: 1, role: 1, isActive: 1 },
                  },
                ],
              },
            },
            { $unwind: "$createdBy" },
            {
              $project: {
                _id: 1,
                name: 1,
                description: 1,
                teams: 1,
                createdBy: 1,
              },
            },
          ],
        },
      },
      { $project: { password: 0 } },
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user[0], { status: 200 });
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
