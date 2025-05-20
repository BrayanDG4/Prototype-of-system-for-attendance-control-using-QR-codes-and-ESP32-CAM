import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    // Leer el cuerpo de la solicitud
    const body = await req.json();

    // Enviar los datos al backend NestJS
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEST_BACKEND_URL}/user/${body.userId}/profile`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: body.fullName,
          phone: body.phone,
          email: body.email,
          address: body.address,
          profileImage: body.profileImage,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
