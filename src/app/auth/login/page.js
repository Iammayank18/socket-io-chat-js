"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  getAccount,
  getUserByEmail,
  signin,
} from "../../../appwrite/appwrite.config";
import {
  decryptPassword,
  getErrorMessage,
} from "../../../functions/helper.function";
import { useGlobalContext } from "../../../context/GlobalContextProvider";
import LabeledInput from "../../../component/LabeledInput";
import Logo from "../../../component/Logo";
import CaptureValidateFace from "../../../component/CaptureValidateFace";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn, setUser } = useGlobalContext();
  const [result, setResult] = useState("");
  const [tab, setTab] = useState("crendentials");
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = useCallback(
    async (values) => {
      setLoading(true);
      try {
        await signin(values);
        const res = await getAccount();

        setUser(res);
        setIsLoggedIn(true);
        router.push("/dashboard/chat");
      } catch (error) {
        setError("error", {
          message: getErrorMessage(error),
        });
        setTimeout(() => {
          clearErrors("error");
        }, 3000);
        setLoading(false);
      }
    },
    [clearErrors, router, setError, setIsLoggedIn, setUser]
  );

  const loginOnDetection = useCallback(async () => {
    if (!result) return;
    try {
      const resultFromDb = await getUserByEmail(result.split(" ")[0]);

      if (resultFromDb) {
        await onSubmit({
          email: resultFromDb.email,
          password: decryptPassword(resultFromDb.password).password,
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  }, [onSubmit, result]);

  useEffect(() => {
    loginOnDetection();
  }, [loginOnDetection, result]);

  return (
    <section className="bg-gray-50 overflow-y-scroll">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="mb-6">
          <Logo />
        </div>
        <div>
          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
            <li className="me-2" onClick={() => setTab("crendentials")}>
              <a
                aria-current="page"
                className={`inline-block cursor-pointer p-4 rounded-t-lg ${
                  tab === "crendentials"
                    ? "active text-blue-600 bg-gray-300"
                    : "text-gray-600 bg-gray-100"
                }`}
              >
                Credentials
              </a>
            </li>
            <li className="me-2" onClick={() => setTab("facial")}>
              <a
                className={`inline-block p-4 cursor-pointer bg-gray-100 rounded-t-lg ${
                  tab === "facial"
                    ? "active text-blue-600 bg-gray-300"
                    : "text-gray-600 bg-gray-100"
                }`}
              >
                Facial
              </a>
            </li>
          </ul>
        </div>
        {tab === "facial" ? (
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                Login with your face 😀
              </h1>
              <CaptureValidateFace setResult={setResult} />
            </div>
          </div>
        ) : (
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Login to your account
              </h1>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <LabeledInput
                    label="Email"
                    type="email"
                    id="email"
                    placeholder="name@company.com"
                    error={errors?.email?.message}
                    {...register("email", {
                      required: "this field is required",
                    })}
                  />
                </div>
                <div>
                  <LabeledInput
                    label="Password"
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    error={errors?.password?.message}
                    {...register("password", {
                      required: "this field is required",
                    })}
                  />
                  {errors.error?.message && (
                    <span className="text-red-500 mb-2">
                      {errors.error?.message}
                    </span>
                  )}
                </div>

                <button
                  disabled={loading}
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                  className="w-full text-black bg-primary-600 border border-gray-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  {loading ? "Logging..." : "Log in"}
                </button>
                <p className="text-sm font-light text-gray-500">
                  Dont have account?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-medium text-primary-600 hover:underline"
                  >
                    Create here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Login;
