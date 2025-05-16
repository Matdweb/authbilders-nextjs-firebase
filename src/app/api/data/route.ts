import { verifySession } from "@/app/lib/dal"

export async function GET() {
    const decoded = await verifySession();
    if (!decoded) {
        return Response.json({
            error: "Unauthorized",
            message: "You are not authorized to access this resource.",
            code: 401,
        }, { status: 200 }); // 200 is used so that client stil displays response
    }
    const data = {
        message: "Hello from API route!",
        timestamp: new Date().toISOString(),
        user_id: decoded.user_id,
        code: 200
    }

    return Response.json({ data }, { status: 200 });
}