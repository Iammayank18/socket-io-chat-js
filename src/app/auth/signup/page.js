"use client";

import Link from "next/link";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createUser } from "../../../appwrite/appwrite.config";
import CaptureImage from "../../../component/CaptureImage";
import LabeledInput from "../../../component/LabeledInput";
import { useGlobalContext } from "../../../context/GlobalContextProvider";
import Logo from "../../../component/Logo";

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn, setUser } = useGlobalContext();
  const [capturedImage, setCapturedImage] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const onSubmit = useCallback(
    async (values) => {
      setLoading(true);
      try {
        const res = await createUser({ ...values, file: capturedImage });
        setUser(res.data);
        setIsLoggedIn(true);
        router.push("/dashboard/chat");
      } catch {
        setLoading(false);
        setError("error", {
          message: "something went wrong",
        });
        setTimeout(() => {
          clearErrors("error");
        }, 1200);
      }
    },
    [capturedImage, clearErrors, router, setError, setIsLoggedIn, setUser]
  );

  const pass = watch("password");
  console.log(capturedImage);

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="mb-6">
          <Logo />
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Create an account
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <div>
                <LabeledInput
                  label="Email"
                  type="email"
                  id="email"
                  placeholder="name@company.com"
                  error={errors?.email?.message}
                  {...register("email", { required: "this field is required" })}
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
              </div>
              <div>
                <LabeledInput
                  label="Confirm Password"
                  type="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  error={errors?.confirmpassword?.message}
                  {...register("confirmpassword", {
                    required: "this field is required",
                    validate: (cpass) => {
                      if (cpass !== pass) {
                        return "password and confirm password not same";
                      }
                      return undefined;
                    },
                  })}
                />
              </div>

              <div>
                <CaptureImage onCapture={(img) => setCapturedImage(img.file)} />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full text-black bg-primary-600 border border-gray-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {loading ? "Creating..." : "Create an account"}
              </button>
              <p className="text-sm font-light text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
