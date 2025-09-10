"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import Image from "next/image";
import { ShowToast } from "@/Helpers/ShowToast";
import Backdrop from "@mui/material/Backdrop";
import { Toaster } from "react-hot-toast";

export default function ClientAuthWrapper({ childComponent }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      if ((pathname != "/login")) {
        router.push("/login");
      }
    } else {
      if ((pathname == "/" || pathname == "/login")) {
        router.push("/");

        // fetch("/api/user/balance", {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         if (data.error) {
        //             router.push("/login");
        //         } else {
        //             setBalance(data.balance);
        //         }
        //     });

      }
    }
    setLoading(false);
  });

  const handleLogin = async (e:any) => {
    if (!phone) {
      return ShowToast("Enter Phone No.", "error");
    }
    if (!password) {
      return ShowToast("Enter Password", "error");
    }

    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        ShowToast(data.message || "Login failed", "error");
      } else {
        // Save token in localStorage (or cookies if you want)
        localStorage.setItem("token", data.token);
        localStorage.setItem("balance", data.balance);
        localStorage.setItem("firstname", data.firstname);

        ShowToast("Login successful!", "success");
        router.push("/");
      }
    } catch (err) {
      ShowToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return <>{token ? childComponent : pathname == "/login" ? <>
    <Backdrop
      sx={{ color: "#fff", zIndex: 9999 }}
      open={loading}
    >
      <span className="loading loading-infinity loading-xl"></span>
    </Backdrop>
    <Toaster position="top-center" reverseOrder={false} />

    <div className="flex flex-col flex-1 lg:w-1/2 w-full p-5">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

        <a
          href="/"
          className="flex items-center mb-2 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <div className="relative w-55 h-25 sm:w-60 sm:h-30 md:w-65 md:h-35">
            <Image
              src="/images/logo/logoblackblue.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </a>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your phone and password to sign in!
            </p>
          </div>
          <div>
            <form>
              <div className="space-y-6">
                <div>
                  <Label>
                    Phone <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="Enter your Phone No." type="phone" defaultValue={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      defaultValue={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div> */}
                <div>
                  <Button className="w-full" size="sm" onClick={(e) => (e.preventDefault(), handleLogin(e))}>
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </> : null}</>;
}
