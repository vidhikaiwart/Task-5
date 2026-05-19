import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authThunks";
import { Link, useNavigate } from "react-router-dom";
import cartoonGirl from "../assets/cartoon_girl.jpg";
import * as yup from "yup";
import toast from "react-hot-toast";

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field on change
    try {
      await loginSchema.validateAt(name, formData);
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await loginSchema.validate(formData, { abortEarly: false });
      const result = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(result)) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(result.payload || "Login failed!");
      }
    } catch (validationErrors) {
      if (validationErrors.inner) {
        const fieldErrors = {};
        validationErrors.inner.forEach((err) => {
          fieldErrors[err.path] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl overflow-hidden flex min-h-[540px] md:min-h-[600px]">
        {/* Left Pane (Hero Panel, visible on medium screens and up) */}
        <div className="relative w-1/2 hidden md:block overflow-hidden select-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 to-purple-900/20 z-10" />
          <img
            src={cartoonGirl}
            alt="Hero Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Pane (Form Panel) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-10 md:p-12 bg-white relative">
          <div className="w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                Welcome back
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Build your design system effortlessly with our powerful component library.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2.5 rounded-lg text-xs mb-5 flex items-start space-x-2">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl focus:outline-none transition-all duration-200 text-sm text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-50 ${
                    errors.email ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-indigo-600"
                  }`}
                  placeholder="alex.jordan@gmail.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl focus:outline-none transition-all duration-200 text-sm text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-50 pr-12 ${
                      errors.password ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-indigo-600"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
                <div className="mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between py-0.5">
                <span className="text-xs font-medium text-slate-600">
                  Remember sign in details
                </span>
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${rememberMe ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${rememberMe ? "translate-x-5" : "translate-x-0.5"
                      }`}
                  />
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-sm"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            {/* Separator */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">or</span>
              </div>
            </div>

            {/* Google Sign-in */}
            <button
              type="button"
              className="w-full flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2.5 px-4 rounded-xl border border-slate-100 transition-all duration-150 active:scale-[0.99] text-sm"
            >
              <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-slate-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;