import { Webhook } from "svix";
import { NextRequest, NextResponse } from "next/server";

// Validar que SVIX_SECRET esté definida
const svixSecret = process.env.SVIX_SECRET;

if (!svixSecret) {
  throw new Error("SVIX_SECRET is not defined in the environment variables");
}

// Crear la instancia del Webhook
const svix = new Webhook(svixSecret);

export async function POST(req: NextRequest) {
  let payload;

  try {
    // Leer el cuerpo de la solicitud
    const body = await req.text();

    // Convertir encabezados a un objeto Record<string, string>
    const headers = Object.fromEntries(req.headers.entries());

    // Verificar el webhook usando Svix
    payload = svix.verify(body, headers);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const { type, data } = payload;

  if (type === "user.created") {
    try {
      // Usar la API de Clerk para actualizar los metadatos públicos
      const response = await fetch(
        `https://api.clerk.dev/v1/users/${data.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            public_metadata: {
              role: "student",
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update user role:", errorData);
        return NextResponse.json(
          { error: "Failed to update user role" },
          { status: response.status }
        );
      }

      console.log(`Assigned role "student" to user ${data.id}`);
    } catch (err) {
      console.error("Failed to assign role:", err);
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Webhook processed successfully" });
}
