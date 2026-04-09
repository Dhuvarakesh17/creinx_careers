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
type SendResendEmailArgs = Omit<ResendSendArgs, "from"> & {
  from?: string;
  allowOnboardingFallback?: boolean;
};

function isUnverifiedDomainError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as {
    message?: unknown;
    name?: unknown;
    statusCode?: unknown;
  };
  const message =
    typeof maybeError.message === "string" ? maybeError.message : "";
  const name = typeof maybeError.name === "string" ? maybeError.name : "";
  const statusCode =
    typeof maybeError.statusCode === "number" ? maybeError.statusCode : null;

  return (
    name.toLowerCase() === "validation_error" &&
    (statusCode === 400 ||
      message.toLowerCase().includes("verified domain") ||
      message.toLowerCase().includes("domain is not verified") ||
      message.toLowerCase().includes("sender") ||
      message.toLowerCase().includes("from address"))
  );
}

export async function sendResendEmail(args: SendResendEmailArgs) {
  const resend = getResendClient();
  const { from, allowOnboardingFallback = true, ...emailArgs } = args;
  const configuredFrom = from?.trim() || process.env.RESEND_FROM_EMAIL?.trim();
  const initialFrom = configuredFrom || RESEND_ONBOARDING_FROM;
  const firstAttemptArgs = {
    ...emailArgs,
    from: initialFrom,
  } as ResendSendArgs;

  const firstAttempt = await resend.emails.send(firstAttemptArgs);

  if (
    allowOnboardingFallback &&
    firstAttempt.error &&
    configuredFrom &&
    configuredFrom !== RESEND_ONBOARDING_FROM &&
    isUnverifiedDomainError(firstAttempt.error)
  ) {
    const fallbackArgs = {
      ...emailArgs,
      from: RESEND_ONBOARDING_FROM,
    } as ResendSendArgs;

    return resend.emails.send(fallbackArgs);
  }

  return firstAttempt;
}
