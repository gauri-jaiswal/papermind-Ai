import React, { useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiService from "../../services/Api.service";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await ApiService.login(formData);

      if (error) {
        const msg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Login failed. Please try again.";
        toast.error(msg);
        return;
      }

      if (data) {
        toast.success(data.message || "Logged in successfully.");
        navigate("/default");
      }
    } catch (err) {
      toast.error(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-grid">
        <div className="auth-marketing d-none d-lg-flex">
          <div className="auth-marketing-inner">
            <div className="auth-badge">
              <i className="bi bi-stars" />
              <span>PaperMind</span>
            </div>
            <h1 className="auth-title">
              Build bots from your documents — fast, searchable, and secure.
            </h1>
            <p className="auth-subtitle">
              Upload PDFs, create a knowledge bot, then chat with citations.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <i className="bi bi-lightning-charge" />
                <div>
                  <div className="auth-feature-title">Instant answers</div>
                  <div className="auth-feature-text pm-muted">
                    Stream responses with context from your files.
                  </div>
                </div>
              </div>
              <div className="auth-feature">
                <i className="bi bi-shield-check" />
                <div>
                  <div className="auth-feature-title">JWT protected</div>
                  <div className="auth-feature-text pm-muted">
                    Your bots and documents stay private to your account.
                  </div>
                </div>
              </div>
              <div className="auth-feature">
                <i className="bi bi-cloud-upload" />
                <div>
                  <div className="auth-feature-title">PDF ready</div>
                  <div className="auth-feature-text pm-muted">
                    Upload and manage files per bot.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-card pm-card">
            <div className="auth-card-header">
              <div className="auth-card-logo">PM</div>
              <div>
                <h2 className="mb-1">Welcome back</h2>
                <div className="pm-muted">Sign in to your workspace</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>

              <div className="text-center mt-3">
                <p className="small pm-muted mb-0">
                  Don&apos;t have an account?{" "}
                  <Link className="auth-link" to="/register">
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
