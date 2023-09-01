import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import "./LoginForm.css";
import { useModal } from "../../context/Modal";

function LoginFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  if (sessionUser) return <Redirect to="/" />;

  const isButtonDisabled = credential.length < 4 || password.length < 6;

  const handleDemoUserLogin = () => {
    const demoUser = {
      credential: "demo@user.io",
      password: "password",
    };

    dispatch(sessionActions.login(demoUser))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors({ credential: data.message });
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors({ credential: data.message });
        }
      });
  };

  return (
    <div className="root-container">
      <h1 className="form-title">Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label className="form-input-label">
            Username or Email
            <input
              className="form-input"
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="input-container">
          <label className="form-input-label">
            Password
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        {errors.credential && (
          <p className="error-message">The provided credentials were invalid</p>
        )}
        <button
          className="submit-button"
          type="submit"
          disabled={isButtonDisabled}
        >
          Log In
        </button>
        <div className="demo-link-container" onClick={handleDemoUserLogin}>
          <span className="demo-link">Demo User</span>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
