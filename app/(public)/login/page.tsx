"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (data.success) {
                router.push("/dashboard");
            } else {
                setError(data.error || "Login failed");
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
                <div className="position-absolute top-0 start-50 translate-middle rounded-circle bg-primary opacity-10" style={{ width: '800px', height: '800px', filter: 'blur(100px)' }}></div>
                <div className="position-absolute bottom-0 end-50 translate-middle-x rounded-circle bg-secondary opacity-10" style={{ width: '600px', height: '600px', filter: 'blur(80px)' }}></div>
            </div>

            <div className="card border-0 shadow-lg" style={{ maxWidth: "400px", width: "100%", zIndex: 1, borderRadius: "1rem" }}>
                <div className="card-body p-5">
                    <div className="text-center mb-5">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                            <i className="bi bi-person-lock fs-1 text-primary"></i>
                        </div>
                        <h4 className="fw-bold mb-1">Welcome Back</h4>
                        <p className="text-muted small">Please sign in to continue</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                            <div>{error}</div>
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingInput" className="text-muted">Email address</label>
                        </div>
                        <div className="form-floating mb-4">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingPassword" className="text-muted">Password</label>
                        </div>

                        <button className="btn btn-primary w-100 py-3 fw-semibold shadow-sm mb-3" type="submit" disabled={loading}>
                            {loading ? (
                                <span>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Logging in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        <div className="text-center mt-4">
                            <a href="#" className="text-decoration-none small text-muted d-block mb-2">Forgot password?</a>
                            <span className="text-muted small">Don't have an account? </span>
                            <a href="/register" className="text-decoration-none small fw-bold text-primary">Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
