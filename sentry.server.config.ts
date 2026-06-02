// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://75a059752d0ee7469a8bf743c7e48742@o4511426015068160.ingest.de.sentry.io/4511426020507728",

  integrations: [
    Sentry.consoleLoggingIntegration({
      levels: ["log", "warn", "error"],
    }),
  ],

  tracesSampleRate: 1,

  enableLogs: true,

  sendDefaultPii: true,
});