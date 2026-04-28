import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, section } from "../styles/layout";
import { button, buttonPrimary, buttonGhost, buttonDanger, h2, input, label, muted } from "../styles/ui";
import { useUser } from "../state/user";

function AccountProfile() {
  const { account, isAuthenticated, signOut, updatePassword } = useUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated || !account) {
    return <Navigate to="/account/create" replace />;
  }

  const isCurrentPasswordValid = currentPassword.length > 0;
  const isNewPasswordValid = newPassword.length >= 8;
  const doPasswordsMatch = newPassword === confirmPassword;

  const canSubmit = isCurrentPasswordValid && isNewPasswordValid && doPasswordsMatch;

  async function handlePasswordChange() {
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      if (!doPasswordsMatch) {
        setError("New passwords do not match.");
        setIsSubmitting(false);
        return;
      }

      const success = await updatePassword({
        currentPassword,
        newPassword,
      });

      if (!success) {
        setError("Current password is incorrect.");
        setIsSubmitting(false);
        return;
      }

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTouched({ currentPassword: false, newPassword: false, confirmPassword: false });
      setIsSubmitting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  }

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Account Settings"
          subtitle="Manage your account information and security."
          right={
            <Link to="/appointments" className={`${button} ${buttonGhost}`}>
              Back to Appointments
            </Link>
          }
        />

        {/* Account Information Card */}
        <Card>
          <div className={section}>
            <div className={h2}>Account Information</div>
            
            <div className="grid gap-6">
              <div>
                <label className={label}>Full Name</label>
                <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  {account.fullName}
                </div>
              </div>

              <div>
                <label className={label}>Email Address</label>
                <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  {account.email}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Account Status
                </div>
                <div className="inline-flex w-fit items-center rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800 dark:bg-teal-900/40 dark:text-teal-200">
                  ✓ Active
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Change Password Card */}
        <Card>
          <div className={section}>
            <div className={h2}>Change Password</div>
            <p className={muted}>Update your password to keep your account secure.</p>

            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                <label className={label}>Current Password</label>
                <input
                  type="password"
                  className={`${input} ${
                    touched.currentPassword && !isCurrentPasswordValid
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40"
                      : ""
                  }`}
                  placeholder="Enter your current password"
                  value={currentPassword}
                  autoComplete="current-password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, currentPassword: true }))}
                  disabled={isSubmitting}
                />
                {touched.currentPassword && !isCurrentPasswordValid ? (
                  <div className="text-xs text-rose-600 dark:text-rose-300">Current password is required.</div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <label className={label}>New Password</label>
                <input
                  type="password"
                  className={`${input} ${
                    touched.newPassword && !isNewPasswordValid
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40"
                      : ""
                  }`}
                  placeholder="Enter your new password"
                  value={newPassword}
                  autoComplete="new-password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, newPassword: true }))}
                  disabled={isSubmitting}
                />
                <div className="text-xs text-slate-500 dark:text-slate-400">Use at least 8 characters.</div>
                {touched.newPassword && !isNewPasswordValid ? (
                  <div className="text-xs text-rose-600 dark:text-rose-300">Password must be at least 8 characters.</div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <label className={label}>Confirm New Password</label>
                <input
                  type="password"
                  className={`${input} ${
                    touched.confirmPassword && !doPasswordsMatch
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40"
                      : ""
                  }`}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                  disabled={isSubmitting}
                />
                {touched.confirmPassword && !doPasswordsMatch ? (
                  <div className="text-xs text-rose-600 dark:text-rose-300">Passwords do not match.</div>
                ) : null}
              </div>

              {error ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-700 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-200">
                  {success}
                </div>
              ) : null}

              <button
                type="button"
                className={`${button} ${buttonPrimary}`}
                onClick={handlePasswordChange}
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </Card>

        {/* Sign Out Card */}
        <Card>
          <div className={section}>
            <div className={h2}>Sign Out</div>
            <p className={muted}>End your current session and return to the login page.</p>
            <button
              type="button"
              className={`${button} ${buttonDanger} w-full sm:w-auto`}
              onClick={signOut}
            >
              Sign Out
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AccountProfile;
