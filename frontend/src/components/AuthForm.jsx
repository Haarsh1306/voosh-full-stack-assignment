import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import AppBar from "../components/AppBar";
import { useEffect } from "react";
import axios from "axios";
import BACKEND_URL from "../../utils/backendUrl";

// eslint-disable-next-line react/prop-types
const AuthForm = ({ type, onSubmit, Error }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParam] = useSearchParams();
  const token = searchParam.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onLoginClick = () => {
    navigate("/login");
  };

  const onSignupClick = () => {
    navigate("/signup");
  };

  const googleLogin = () => {
    window.location.href = BACKEND_URL.auth.google;
  };
  useEffect(() => {
    const getMe = async () => {
      try {
        const result = await axios.get(BACKEND_URL.auth.me, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (result.data.success) {
          localStorage.setItem("AUTH_TOKEN", token); 
          navigate("/dashboard");
        }
      } catch {
        navigate("/login");
      }
    };
    getMe();
  }, [token, navigate]);

  const actions = () => {
    return (
      <div>
        <button
          className={`mr-2 btn ${
            location.pathname === "/login"
              ? "bg-white text-blue-500 px-2 py-1 rounded-sm"
              : "text-white"
          }`}
          onClick={onLoginClick}
        >
          Login
        </button>
        <button
          className={`${
            location.pathname === "/signup"
              ? "bg-white text-blue-500 px-2 py-1 rounded-sm"
              : "text-white"
          }`}
          onClick={onSignupClick}
        >
          Signup
        </button>
      </div>
    );
  };

  const renderFormFields = () => {
    if (type === "signup") {
      return (
        <>
          <input
            type="text"
            placeholder="First Name"
            {...register("first_name", { required: "First Name is required" })}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}

          <input
            type="text"
            placeholder="Last Name"
            {...register("last_name", { required: "Last Name is required" })}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}

          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirm_password", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          />
          {errors.confirmPassword && (
            <span className="text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </>
      );
    } else {
      return (
        <>
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </>
      );
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <AppBar actions={actions} />
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <div className="flex justify-start w-1/3">
          <h2 className="text-blue-500 text-2xl font-semibold">
            {type === "signup" ? "Sign Up" : "Login"}
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-2 border-blue-500 p-5 rounded-md shadow-md w-1/3"
        >
          {renderFormFields()}
          <div className="flex flex-col gap-3 mt-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition"
            >
              {type === "signup" ? "Sign Up" : "Login"}
            </button>
            {Error && <span className="text-red-500">{Error}</span>}
            <div className="flex justify-center items-center gap-2">
              <span className="font-semibold">
                {type === "signup"
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>
              <Link
                className="font-semibold text-blue-500"
                to={type === "signup" ? "/login" : "/signup"}
              >
                {type === "signup" ? "Login" : "Sign Up"}
              </Link>
            </div>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition"
              onClick={googleLogin}
            >
              {type === "signup" ? "Sign Up" : "Login"} with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
