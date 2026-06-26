import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../api";

export function ProfilePage() {
  const { user, updateProfile, refreshUser } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  async function saveProfile(event) {
    event.preventDefault();
    try {
      await updateProfile(profile);
      toast.notify("Profile updated");
      await refreshUser();
    } catch (error) {
      toast.notify(error.response?.data?.message || "Update failed", "error");
    }
  }

  async function savePassword(event) {
    event.preventDefault();
    try {
      await api.post("/auth/change-password", password);
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.notify("Password changed");
    } catch (error) {
      toast.notify(error.response?.data?.message || "Password update failed", "error");
    }
  }

  return (
    <div className="stack">
      <section className="panel">
        <h3>Account details</h3>
        <form className="form-grid" onSubmit={saveProfile}>
          <label>
            Full Name
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </label>
          <label>
            Email
            <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </label>
          <button className="primary-btn">Save profile</button>
        </form>
      </section>

      <section className="panel">
        <h3>Change password</h3>
        <form className="form-grid" onSubmit={savePassword}>
          <label>
            Current password
            <input type="password" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} />
          </label>
          <label>
            New password
            <input type="password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={password.confirmPassword}
              onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
            />
          </label>
          <button className="ghost-btn">Update password</button>
        </form>
      </section>
    </div>
  );
}
