import { NextRequest, NextResponse } from "next/server";

import { sendWorkflowExecution } from "@/inngest/utils";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing workflowId",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    await sendWorkflowExecution({
      workflowId,
      input: body,
    });

    return NextResponse.json({
      success: true,
      workflowId,
      received: body,
    });
  } catch (error) {
    console.error("Google Form webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Google Form webhook failed",
      },
      { status: 500 }
    );
  }
}