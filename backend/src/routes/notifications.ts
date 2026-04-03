import { Router, Request, Response } from "express";
import { initServerClient } from "vibe-message";

const router = Router();

router.post("/send-notification", async (req: Request, res: Response) => {
  try {
    const { title, body, icon, clickAction, externalUsers } = req.body;

    // Validate required fields
    if (!title || !body) {
      return res.status(400).json({
        success: false,
        error: "title and body are required",
      });
    }

    // Get credentials from environment
    const appId = process.env.VIBE_MESSAGE_APP_ID;
    const secretKey = process.env.VIBE_MESSAGE_SECRET_KEY;
    const baseUrl = "http://localhost:3200/api";

    if (!appId || !secretKey) {
      console.error("Missing Vibe Message configuration");
      return res.status(500).json({
        success: false,
        error: "Server not configured for notifications",
      });
    }

    // Initialize Vibe Message server client
    const server = initServerClient({
      baseUrl,
      appId,
      secretKey,
    });

    // Build notification options
    const notificationOptions = {
      notificationData: {
        title,
        body,
        icon: icon || "/placeholder.svg",
        click_action: clickAction || "/",
      },
      ...(externalUsers &&
      Array.isArray(externalUsers) &&
      externalUsers.length > 0
        ? { externalUsers }
        : {}),
    };

    // Send notification
    const result = await server.notification(notificationOptions);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send notification",
    });
  }
});

export default router;
