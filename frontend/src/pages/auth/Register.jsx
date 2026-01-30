import React, { useState } from "react";
import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/Api.service";
import { toast } from "react-toastify";
const Register = () => {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    company_name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone_number, company_name, password } = formData;

    if (!name || !email || !phone_number || !company_name || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone_number)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await ApiService.register(formData);

      if (error) {
        const msg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Registration failed. Please try again.";
        toast.error(msg);
        return;
      }

      if (data) {
        toast.success(data.message || "Account created successfully.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err?.message || "Registration failed. Please try again.");
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
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">
              Start by setting up your workspace. You can create bots and upload
              documents in minutes.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <i className="bi bi-robot" />
                <div>
                  <div className="auth-feature-title">Multiple bots</div>
                  <div className="auth-feature-text pm-muted">
                    Create separate bots per project or team.
                  </div>
                </div>
              </div>
              <div className="auth-feature">
                <i className="bi bi-search" />
                <div>
                  <div className="auth-feature-title">Semantic search</div>
                  <div className="auth-feature-text pm-muted">
                    Get accurate answers from your files.
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
                <h2 className="mb-1">Get started</h2>
                <div className="pm-muted">Create your PaperMind account</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Full name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>

                <div className="col-12">
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

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    type="tel"
                    name="phone_number"
                    className="form-control form-control-lg"
                    placeholder="10-digit number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    inputMode="numeric"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Company</label>
                  <input
                    type="text"
                    name="company_name"
                    className="form-control form-control-lg"
                    placeholder="Company name"
                    value={formData.company_name}
                    onChange={handleChange}
                    autoComplete="organization"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <div className="form-text pm-muted">
                    Use a strong password you don’t use elsewhere.
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 mt-3 d-flex align-items-center justify-content-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Creating…
                  </>
                ) : (
                  "Create account"
                )}
              </button>

              <div className="text-center mt-3">
                <p className="small pm-muted mb-0">
                  Already have an account?{" "}
                  <Link className="auth-link" to="/login">
                    Sign in
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

export default Register;
