import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, section } from "../styles/layout";
import { button, buttonPrimary, buttonGhost, h2, input, label, muted } from "../styles/ui";
import { useAppointments } from "../state/appointments";
import { useUser } from "../state/user";

function AccountCreate() {
  const navigate = useNavigate();
  const {
    account,
    hasRegisteredAccount,
    isAuthenticated,
    createAccount,
    signIn,
    signOut,
    clearAccount,
  } = useUser();
  const { clearAppointments } = useAppointments();

  const [mode, setMode] = useState<"register" | "signin">(
    hasRegisteredAccount ? "signin" : "register"
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/appointments");
    }
  }, [isAuthenticated, navigate]);

  const isNameValid = fullName.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword;

  const canSubmit =
    isEmailValid &&
    isPasswordValid &&
    (mode === "signin" || (isNameValid && doPasswordsMatch));

  const passwordHint = "Use at least 8 characters.";

  async function handleSubmit() {
    setError("");
    setIsSubmitting(true);

    if (mode === "register") {
      if (!doPasswordsMatch) {
        setError("Passwords do not match.");
        setIsSubmitting(false);
        return;
      }
      const success = await createAccount({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });
      if (!success) {
        setError("Unable to create account. Please try again.");
        setIsSubmitting(false);
        return;
      }
    } else {
      const success = await signIn({ email, password });
      if (!success) {
        setError("Email or password is incorrect.");
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    navigate("/appointments");
  }

  const authTitle = isAuthenticated
    ? "Account" 
    : mode === "register"
    ? "Create your account"
    : "Sign in to Commerce Bank";

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title={authTitle}
          subtitle="Secure your appointments with an account and password."
        />

        <Card>
          <div className={section}>
            {isAuthenticated && account ? (
              <>
                <div className={h2}>Welcome back, {account.fullName}</div>
                <p className={muted}>You are signed in with {account.email}.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link to="/appointments" className={`${button} ${buttonPrimary}`}>
                    Go to Appointments
                  </Link>
                  <button
                    type="button"
                    className={`${button} ${buttonGhost}`}
                    onClick={signOut}
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className={`${button} ${mode === "register" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-100"}`}
                    onClick={() => setMode("register")}
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    className={`${button} ${mode === "signin" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-100"}`}
                    onClick={() => setMode("signin")}
                  >
                    Sign In
                  </button>
                </div>
                {hasRegisteredAccount && mode === "register" ? (
                  <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    An existing account is saved. Registering again will replace the current stored account.
                  </div>
                ) : null}

                <div className="mt-6 grid gap-6">
                  {mode === "register" ? (
                    <div className="flex flex-col gap-2">
                      <label className={label}>Full Name</label>
                      <input
                        className={`${input} ${touched.name && !isNameValid ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40" : ""}`}
                        placeholder="e.g. Jane Doe"
                        value={fullName}
                        autoComplete="name"
                        onChange={(event) => setFullName(event.target.value)}
                        onBlur={() => setTouched((current) => ({ ...current, name: true }))}
                      />
                      {touched.name && !isNameValid ? (
                        <div className="text-xs text-rose-600 dark:text-rose-300">Please enter your full name.</div>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-2">
                    <label className={label}>Email Address</label>
                    <input
                      type="email"
                      className={`${input} ${touched.email && !isEmailValid ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40" : ""}`}
                      placeholder="e.g. jane@example.com"
                      value={email}
                      autoComplete="email"
                      onChange={(event) => setEmail(event.target.value)}
                      onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                    />
                    {touched.email && !isEmailValid ? (
                      <div className="text-xs text-rose-600 dark:text-rose-300">Enter a valid email address.</div>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={label}>Password</label>
                    <input
                      type="password"
                      className={`${input} ${touched.password && !isPasswordValid ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40" : ""}`}
                      placeholder="Enter a secure password"
                      value={password}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      onChange={(event) => setPassword(event.target.value)}
                      onBlur={() => setTouched((current) => ({ ...current, password: true }))}
                    />
                    <div className="text-xs text-slate-500 dark:text-slate-400">{passwordHint}</div>
                    {touched.password && !isPasswordValid ? (
                      <div className="text-xs text-rose-600 dark:text-rose-300">Password must be at least 8 characters.</div>
                    ) : null}
                  </div>

                  {mode === "register" ? (
                    <div className="flex flex-col gap-2">
                      <label className={label}>Confirm Password</label>
                      <input
                        type="password"
                        className={`${input} ${touched.confirmPassword && !doPasswordsMatch ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40" : ""}`}
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        autoComplete="new-password"
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        onBlur={() => setTouched((current) => ({ ...current, confirmPassword: true }))}
                      />
                      {touched.confirmPassword && !doPasswordsMatch ? (
                        <div className="text-xs text-rose-600 dark:text-rose-300">Passwords do not match.</div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {error ? <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200">{error}</div> : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className={`${button} ${buttonPrimary}`}
                    disabled={!canSubmit || isSubmitting}
                    onClick={handleSubmit}
                  >
                    {mode === "register" ? "Create Account" : "Sign In"}
                  </button>

                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {mode === "register"
                      ? "Already have an account?"
                      : "Need an account?"}
                    <button
                      type="button"
                      className="ml-2 font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
                      onClick={() => setMode(mode === "register" ? "signin" : "register")}
                    >
                      {mode === "register" ? "Sign In" : "Register"}
                    </button>
                  </div>
                </div>
                <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <button
                    type="button"
                    className={`${button} ${buttonGhost} w-full text-center`}
                    onClick={() => {
                      clearAccount();
                      clearAppointments();
                      navigate("/");
                    }}
                  >
                    Reset all test data
                  </button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AccountCreate;
