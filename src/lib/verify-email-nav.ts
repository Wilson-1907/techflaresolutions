/** Hard navigation to the OTP page (more reliable than client router after form POST). */
export function goToVerifyEmail(params: {
  email: string;
  role?: string;
  notice?: "email-failed";
  resent?: boolean;
}) {
  const q = new URLSearchParams();
  q.set("email", params.email);
  if (params.role) q.set("role", params.role);
  if (params.notice) q.set("notice", params.notice);
  if (params.resent) q.set("resent", "1");
  window.location.assign(`/verify-email?${q.toString()}`);
}
