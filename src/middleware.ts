import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "@/lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = auth();

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/", "/sign-in", "/sign-up", "/onboarding"];
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    console.log(`Access granted to public route: ${req.nextUrl.pathname}`);
    return NextResponse.next();
  }

  // Extraer el rol desde los claims de la sesión
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const userId = sessionClaims?.sub;

  console.log("Detected role:", role);

  // Si no hay rol, esperar que el usuario esté completamente creado
  if (!role) {
    console.log("No role detected. Verifying user existence...");

    if (userId) {
      try {
        const userResponse = await fetch(
          `https://api.clerk.dev/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (userResponse.ok) {
          const user = await userResponse.json();
          if (!user.public_metadata?.role) {
            console.log("User exists but no role assigned. Redirecting...");
            return NextResponse.redirect(new URL("/onboarding", req.url));
          }
        } else {
          console.error(
            "Failed to fetch user details:",
            await userResponse.text()
          );
        }
      } catch (err) {
        console.error("Error while verifying user existence:", err);
      }
    }
  }

  // Construir la URL esperada del dashboard para el rol del usuario
  const expectedDashboardUrl = `/dashboard/${role}`;

  // Redirigir al dashboard del rol después del inicio de sesión
  if (
    req.nextUrl.pathname ===
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL
  ) {
    console.log("Redirecting user to their dashboard:", expectedDashboardUrl);
    return NextResponse.redirect(new URL(expectedDashboardUrl, req.url));
  }

  // Verificar si la ruta es protegida y si el rol no tiene acceso
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role)) {
      console.log(
        "User does not have access to this route. Redirecting to:",
        expectedDashboardUrl
      );
      return NextResponse.redirect(new URL(expectedDashboardUrl, req.url));
    }
  }

  console.log("Access granted to:", req.nextUrl.pathname);
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js|map|json|ico|png|jpg|jpeg|svg|woff|woff2|ttf|eot|otf)).*)",
    "/(api|trpc)(.*)",
  ],
};
