import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const authorizationId = formData.get("authorization_id") as string;
    const decision = formData.get("decision") as string;

    if (!authorizationId) {
      return NextResponse.json(
        { error: "Missing authorization_id" },
        { status: 400 }
      );
    }

    if (!decision || !["approve", "deny"].includes(decision)) {
      return NextResponse.json(
        { error: "Invalid decision value" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // For Supabase OAuth, getAuthorizationDetails acts as both get AND approve
    // It returns the redirect_url with the authorization code
    if (decision === "approve") {
      const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
      
      if (error) {
        console.error("OAuth getAuthorizationDetails error:", {
          message: error.message,
          status: error.status,
          code: error.code,
          authorizationId,
          userId: user.id,
        });
        return NextResponse.json(
          { 
            error: error.message || "Failed to process authorization",
            details: error.code || "unknown_error"
          },
          { status: error.status || 500 }
        );
      }

      if (!data?.redirect_url) {
        return NextResponse.json(
          { error: "Missing redirect URL from authorization response" },
          { status: 500 }
        );
      }

      // Redirect to the OAuth client's redirect_uri with auth code
      return NextResponse.redirect(data.redirect_url);
    } else {
      // For deny, we use denyAuthorization
      const { data, error } = await supabase.auth.oauth.denyAuthorization(authorizationId);

      if (error) {
        console.error("OAuth denyAuthorization error:", {
          message: error.message,
          status: error.status,
          code: error.code,
          authorizationId,
          userId: user.id,
        });
        return NextResponse.json(
          { 
            error: error.message || "Failed to deny authorization",
            details: error.code || "unknown_error"
          },
          { status: error.status || 500 }
        );
      }

      if (!data?.redirect_url) {
        return NextResponse.json(
          { error: "Missing redirect URL from deny response" },
          { status: 500 }
        );
      }

      return NextResponse.redirect(data.redirect_url);
    }
  } catch (err) {
    console.error("OAuth decision error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
