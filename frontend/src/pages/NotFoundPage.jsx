import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="center-panel">
      <div className="auth-card">
        <h2>Page not found</h2>
        <p className="muted">The route you tried does not exist.</p>
        <Link className="primary-btn center-link" to="/">
          Go home
        </Link>
      </div>
    </div>
  );
}
