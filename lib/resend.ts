import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const RESEND_ONBOARDING_FROM = "onboarding@resend.dev";

export function getResendClient() {
  if (!resendApiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  return new Resend(resendApiKey);
}

type ResendSendArgs = Parameters<Resend["emails"]["send"]>[0];

function isUnverifiedDomainError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { message?: unknown; name?: unknown };
  const message =
    typeof maybeError.message === "string" ? maybeError.message : "";
  const name = typeof maybeError.name === "string" ? maybeError.name : "";

  return (
    name.toLowerCase() === "validation_error" &&
    message.toLowerCase().includes("domain is not verified")
  );
}

export async function sendResendEmail(args: Omit<ResendSendArgs, "from">) {
  const resend = getResendClient();
  const configuredFrom = process.env.RESEND_FROM_EMAIL?.trim();
  const initialFrom = configuredFrom || RESEND_ONBOARDING_FROM;
  const firstAttemptArgs = {
    ...args,
    from: initialFrom,
  } as ResendSendArgs;

  const firstAttempt = await resend.emails.send(firstAttemptArgs);

  if (
    firstAttempt.error &&
    configuredFrom &&
    configuredFrom !== RESEND_ONBOARDING_FROM &&
    isUnverifiedDomainError(firstAttempt.error)
  ) {
    const fallbackArgs = {
      ...args,
      from: RESEND_ONBOARDING_FROM,
    } as ResendSendArgs;

    return resend.emails.send(fallbackArgs);
  }

  return firstAttempt;
}
