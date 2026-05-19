import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authThunks";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import cartoonGirl from "../assets/cartoon_girl.jpg";
import * as yup from "yup";

const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email"),
  role: yup
    .string()
    .trim()
    .oneOf(["user", "admin"], "Role must be either 'user' or 'admin'"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field on change
    try {
      await registerSchema.validateAt(name, formData);
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await registerSchema.validate(formData, { abortEarly: false });
      const { confirmPassword, ...registerData } = formData;
      const result = await dispatch(registerUser(registerData));
      if (registerUser.fulfilled.match(result)) {
        toast.success("Registration successful!");
        navigate("/dashboard");
      } else {
        toast.error(result.payload || "Registration failed!");
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
                Create your account
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get started with Nucleus and build your design system effortlessly.
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
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl focus:outline-none transition-all duration-200 text-sm text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-50 ${
                    errors.name ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-indigo-600"
                  }`}
                  placeholder="Alex Jordan"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
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

              {/* Role */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 text-sm text-slate-900"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
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
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl focus:outline-none transition-all duration-200 text-sm text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-50 ${
                    errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-indigo-600"
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-sm"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
