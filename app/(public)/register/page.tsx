"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 w-100 d-flex align-items-center justify-content-center bg-light">
      {/* Background decoration */}
      <div className="position-fixed top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0 }}>
        <div className="position-absolute bottom-0 start-0 translate-middle-x rounded-circle bg-primary opacity-10" style={{ width: '600px', height: '600px', filter: 'blur(80px)' }}></div>
        <div className="position-absolute top-50 end-0 translate-middle-y rounded-circle bg-primary opacity-10" style={{ width: '500px', height: '500px', filter: 'blur(100px)' }}></div>
      </div>

      <div className="card border-0 shadow-lg" style={{ maxWidth: "450px", width: "100%", zIndex: 1, borderRadius: "1rem" }}>
        <div className="card-body p-5">
          <div className="text-center mb-5">
            <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
              <i className="bi bi-person-plus fs-1 text-primary"></i>
            </div>
            <h4 className="fw-bold mb-1">Create Account</h4>
            <p className="text-muted small">Join to manage resources</p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-circle-fill me-2"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingName"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <label htmlFor="floatingName" className="text-muted">Full Name</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <label htmlFor="floatingEmail" className="text-muted">Email address</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <label htmlFor="floatingPassword" className="text-muted">Password</label>
            </div>

            <div className="form-floating mb-4">
              <select
                className="form-select"
                id="floatingRole"
                aria-label="Floating label select example"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
                <option value="APPROVER">Approver</option>
              </select>
              <label htmlFor="floatingRole">I am a...</label>
            </div>

            <button className="btn btn-primary w-100 py-3 fw-semibold shadow-sm mb-3" type="submit" disabled={loading}>
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center">
              <span className="text-muted small">Already have an account? </span>
              <Link href="/login" className="text-decoration-none small fw-bold text-primary">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
