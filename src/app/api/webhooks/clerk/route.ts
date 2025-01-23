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
    const { id: clerkId, email_addresses } = data;

    try {
      // Asignar rol 'student' por defecto en Clerk
      const clerkResponse = await fetch(
        `https://api.clerk.dev/v1/users/${clerkId}`,
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

      if (!clerkResponse.ok) {
        const errorData = await clerkResponse.json();
        console.error("Failed to update user role in Clerk:", errorData);
        return NextResponse.json(
          { error: "Failed to update user role in Clerk" },
          { status: clerkResponse.status }
        );
      }

      console.log(`Assigned role "student" to user ${clerkId}`);

      // Enviar el userId y email al backend para procesamiento adicional
      const backendResponse = await fetch(
        `${process.env.NEST_BACKEND_URL}/user/create-student`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: clerkId,
            email: email_addresses[0]?.email_address || "unknown@example.com",
          }),
        }
      );

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        console.error("Failed to send user to backend:", errorData);
        return NextResponse.json(
          { error: "Failed to send user to backend" },
          { status: backendResponse.status }
        );
      }

      console.log(`User sent to backend with ID ${clerkId}`);
    } catch (err) {
      console.error("Error processing user:", err);
      return NextResponse.json(
        { error: "Failed to process user" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Webhook processed successfully" });
}
