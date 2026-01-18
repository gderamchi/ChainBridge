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

    let data, error;

    if (decision === "approve") {
      const result = await supabase.auth.oauth.approveAuthorization(authorizationId);
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase.auth.oauth.denyAuthorization(authorizationId);
      data = result.data;
      error = result.error;
    }

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to process authorization decision" },
        { status: 500 }
      );
    }

    if (!data?.redirect_url) {
      return NextResponse.json(
        { error: "Missing redirect URL from authorization response" },
        { status: 500 }
      );
    }

    // Redirect to the OAuth client's redirect_uri
    return NextResponse.redirect(data.redirect_url);
  } catch (err) {
    console.error("OAuth decision error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
