import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

// Obtener todos los usuarios
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Obtener todos los usuarios
    const response = await clerkClient.users.getUserList();
    const users = response.data;

    // Paginar los usuarios
    const start = (page - 1) * limit;
    const paginatedUsers = users.slice(start, start + limit);

    // Formatear los usuarios para el frontend
    const formattedUsers = paginatedUsers.map((user) => ({
      id: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      emailAddresses: user.emailAddresses || [],
      publicMetadata: user.publicMetadata || { role: "guest" },
    }));

    return NextResponse.json({
      users: formattedUsers,
      total: users.length,
      page,
      limit,
    });
  } catch (error: any) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json(
      {
        message: "Error al obtener usuarios",
        error: error.errors || error.message,
      },
      { status: 500 }
    );
  }
}

// Crear un nuevo usuario
export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, role, password } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        { message: "El correo y el rol son obligatorios." },
        { status: 400 }
      );
    }

    // Generar una contraseña aleatoria si no se proporciona
    const userPassword = password || Math.random().toString(36).slice(-8);

    // Crear usuario en Clerk
    const user = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName: firstName?.trim() || undefined,
      lastName: lastName?.trim() || undefined,
      publicMetadata: { role },
      password: userPassword, // Si Clerk requiere contraseñas
    });

    return NextResponse.json({
      message: "Usuario creado exitosamente",
      user,
    });
  } catch (error: any) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      {
        message: error?.message || "Error al crear usuario",
        errors: error?.errors || [],
      },
      { status: 500 }
    );
  }
}

// Actualizar el rol de un usuario existente
export async function PUT(request: Request) {
  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { message: "El ID del usuario y el rol son obligatorios" },
        { status: 400 }
      );
    }

    const user = await clerkClient.users.updateUser(userId, {
      publicMetadata: { role },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error al actualizar rol del usuario:", error);
    return NextResponse.json(
      {
        message: "Error al actualizar rol del usuario",
        error: error.errors || error.message,
      },
      { status: 500 }
    );
  }
}

// Eliminar un usuario existente
export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "El ID del usuario es obligatorio" },
        { status: 400 }
      );
    }

    await clerkClient.users.deleteUser(userId);

    return NextResponse.json({ message: "Usuario eliminado exitosamente" });
  } catch (error: any) {
    console.error("Error al eliminar usuario:", error);
    return NextResponse.json(
      {
        message: "Error al eliminar usuario",
        error: error.errors || error.message,
      },
      { status: 500 }
    );
  }
}
