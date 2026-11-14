import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, AlertCircle, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { validateLogin } from "../utils/validators";

export default function Login({ onLogin, loading: propLoading, error: propError }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination if user was redirected from a protected route
  const from = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [internalLoading, setInternalLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const loading = propLoading || internalLoading;
  const currentError = propError || serverError;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const { isValid, errors: validationErrors } = validateLogin(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      setInternalLoading(true);

      if (onLogin) {
        const user = await onLogin({
          email: formData.email.trim(),
          password: formData.password,
        });

        // Redirect based on role
        if (user?.role === "ADMIN") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate(from === "/login" ? "/dashboard" : from, { replace: true });
        }
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password. Please try again.";
      setServerError(msg);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-rural-600 text-white flex items-center justify-center mx-auto shadow-md mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Log in to continue your rural e-learning journey
          </p>
        </div>

        {/* Card Form */}
        <Card className="shadow-card border-slate-200">
          {/* Server Error Message */}
          {currentError && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{currentError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              required
              autoComplete="current-password"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="md"
                loading={loading}
                icon={ArrowRight}
              >
                Log In
              </Button>
            </div>
          </form>

          {/* Educational tips */}
          <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
            Free and secure access for both students and instructors.
          </div>
        </Card>

        {/* New user link */}
        <p className="text-center text-sm text-slate-600">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
}
