import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { forgotPassword, loginUser, resendVerification, resetPassword, signupUser } from '../redux/features/authSlice';

const AuthModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, otpSent, shouldOfferResend, resendEmail, resendLoading } = useSelector((state) => state.auth);

  const [view, setView] = useState("login");
  const [isChecked, setIsChecked] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password) {
      return toast.error("All Fields are required");
    }
    if (!isChecked) {
      return toast, error("Please Check First");
    }

    try {
      await dispatch(loginUser({ email: form.email, password: form.password })).unwrap();
      onClose();
    } catch { }
  }

  const handleSignup = async () => {
    if (!form.name || !form.email.trim() || !form.password) {
      return toast.error("All fields are Required");
    }
    if (!isChecked) {
      return toast.error("Please Check First");
    }
    try {
      await dispatch(signupUser({ name: form.name, email: form.email, password: form.password })).unwrap();
      changeView("login");
    } catch { }
  }

  const handleSendOtp = async () => {
    if (!form.email.trim()) {
      return toast.error("Please enter your email");
    }

    try {
      await dispatch(forgotPassword({ email: form.email })).unwrap();
      changeView("reset");
    } catch { }
  }

  const handleResetPassword = async () => {
    if (!form.email.trim() || !form.otp || !form.password) {
      return toast.error("All fields are Required");
    }
    if (!otpSent) return toast.error("OTP not sent yet. Please send OTP first.");

    try {
      await dispatch(resetPassword({ email: form.email, otp: form.otp, newPassword: form.password })).unwrap();
      changeView("login");
    } catch { }
  }

  const handleResendVerify = async () => {
    const targetEmail = form.email || resendEmail;
    if (!targetEmail) {
      return toast.error("Please Provide Email");
    }

    try {
      await dispatch(resendVerification({ email: form.email })).unwrap();
    } catch { }
  }

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-background") {
      changeView("login");
      onClose();
    }
  };

  const changeView = (newView) => {
    setView(newView);

    setForm((prev) => ({
      ...prev,
      password: "",
      otp: ""
    }));
    setShowPassword(false);
  };
  return (
    <div
      id="modal-background"
      onClick={handleOutsideClick}
      className="fixed inset-0 bg-black/25 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        className="bg-[#1a1a1ae3] shadow-[0_4px_20px_rgba(0,0,0,0.45)] rounded-md w-full max-w-sm p-6 relative mx-4 md:mx-0"
        onClick={(e) => e.stopPropagation()}
      >

        {view === "login" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center text-white tracking-widest">LOGIN</h2>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              className="w-full md:text-sm outline-none border border-[#3a3a3a] px-2 py-1.5 rounded mb-3 text-neutral-300 bg-transparent tracking-wider focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none"
            />
            <div className="relative mb-2">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full md:text-sm outline-none border border-[#3a3a3a] px-2 py-1.5 rounded text-neutral-300 bg-transparent pr-10 tracking-wider focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none"
              />
              {form.password.length > 0 && (<span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={togglePassword}
              >
                {showPassword ? <EyeSlashIcon weight='fill' color='#9FA6B2' /> : <EyeIcon weight='fill' color='#9FA6B2' />}
              </span>)}
            </div>

            <button
              onClick={() => setView("forgot")}
              className="text-xs text-amber-500 mt-1 mb-2 block ml-auto cursor-pointer font-semibold tracking-widest"
              type="button"
            >
              Forgot Password?
            </button>

            <div className="flex items-start gap-1 mb-3 justify-center">
              <input
                className="mt-0.5"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <p className="text-xs text-white font-light tracking-widest">
                By Continuing, I agree to the terms of use and privacy policy.
              </p>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full text-sm bg-[#FF6347] text-black font-semibold py-2 rounded mb-2 tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </span>
              ) : (
                "LOGIN"
              )}
            </button>

            {shouldOfferResend && (
              <div className="mb-3 text-center">
                <p className="text-xs text-red-400 mb-2">
                  Your email is not verified. Didn’t get the email?
                </p>
                <button
                  onClick={handleResendVerify}
                  disabled={resendLoading}
                  className="w-full bg-[#facc15] text-black font-semibold py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      Sending...
                    </span>
                  ) : (
                    "Send verification link again"
                  )}
                </button>
              </div>
            )}

            <p className="text-sm text-center text-white font-light tracking-widest">
              Don’t have an account?{" "}
              <span
                onClick={() => changeView("signup")}
                className="cursor-pointer font-normal hover:underline"
              >
                Sign Up
              </span>
            </p>
          </div>
        )}

        {view === "signup" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center text-white tracking-widest">SIGN UP</h2>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Name"
              className="w-full md:text-sm outline-none border border-[#3a3a3a] px-2 py-1.5 rounded mb-3 text-neutral-300 bg-transparent tracking-wider focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              className="w-full md:text-sm outline-none border border-[#3a3a3a] px-2 py-1.5 rounded mb-3 text-neutral-300 bg-transparent tracking-wider focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none"
            />
            <div className="relative mb-3">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full md:text-sm outline-none border border-[#3a3a3a] px-2 py-1.5 rounded text-neutral-300 bg-transparent pr-10 tracking-wider focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none"
              />
              {form.password.length > 0 && (<span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={togglePassword}
              >
                {showPassword ? <EyeSlashIcon weight='fill' color='#9FA6B2' /> : <EyeIcon weight='fill' color='#9FA6B2' />}
              </span>)}
            </div>

            <div className="flex items-start gap-1 mb-3 justify-center">
              <input
                className="mt-0.5"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <p className="text-xs text-white font-light tracking-widest">
                By Continuing, I agree to the terms of use and privacy policy.
              </p>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full text-sm bg-[#FF6347] text-black font-bold py-2 rounded mb-3 tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Creating...
                </span>
              ) : (
                "SIGN UP"
              )}
            </button>

            <p className="text-sm text-center text-white font-light tracking-widest">
              Already have an account?{" "}
              <span
                onClick={() => changeView("login")}
                className="cursor-pointer font-normal hover:underline"
              >
                Login
              </span>
            </p>
          </div>
        )}

        {view === "forgot" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center text-white tracking-widest">FORGOT PASSWORD</h2>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="w-full md:text-sm outline-none border border-[#3a3a3a] px-2 py-1.5 rounded mb-3 text-white bg-transparent tracking-wider focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full text-sm bg-[#FF6347] text-black font-bold py-2 rounded mb-3 tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </span>
              ) : (
                "SEND OTP"
              )}
            </button>
            <p onClick={() => changeView("login")} className="md:text-[11px] text-sm text-white cursor-pointer text-center tracking-widest">
              BACK TO LOGIN
            </p>
          </div>
        )}

        {view === "reset" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center text-white tracking-widest">RESET PASSWORD</h2>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="w-full md:text-sm outline-none border border-[#3a3a3a] px-2 py-1.5 rounded mb-3 text-neutral-300 bg-transparent tracking-wider focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none"
            />
            <input
              name="otp"
              value={form.otp}
              onChange={handleChange}
              type="text"
              placeholder="Enter OTP"
              className="w-full md:text-sm outline-none border border-[#3a3a3a] px-2 py-1.5 rounded mb-3 text-neutral-300 bg-transparent tracking-wider focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none"
            />
            <div className="relative mb-3">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full md:text-sm outline-none border border-[#3a3a3a] px-2 py-1.5 rounded text-neutral-300 bg-transparent pr-10 tracking-wider focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none"
              />
              {form.password.length > 0 && (<span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={togglePassword}
              >
                {showPassword ? <EyeSlashIcon weight='fill' color='#9FA6B2' /> : <EyeIcon weight='fill' color='#9FA6B2' />}
              </span>)}
            </div>
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full text-sm bg-[#FF6347] text-black font-bold py-2 rounded mb-3 tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Resetting...
                </span>
              ) : (
                "RESET PASSWORD"
              )}
            </button>
            <p onClick={() => changeView("login")} className="md:text-[11px] text-sm text-white cursor-pointer text-center tracking-widest">
              BACK TO LOGIN
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthModal