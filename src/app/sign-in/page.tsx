// app/auth/signin/page.tsx (Next.js App Router)
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { useAuth } from "@/context/AuthContext";
import { Input } from "antd";
export default function SignIn() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state for handling login errors
  const router = useRouter(); // Initialize useRouter
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response: any = await login(email, password);
      if (response.success) {
        router.push("/");
      } else {
        setError(response.message || "Нэвтрэх амжилтгүй боллоо");
      }
    } catch (error) {
      setError("Алдаа гарлаа. Та дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-800 ">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="  mx-auto  w-[300px] rounded-2xl "
            src="/logo.png"
            alt="Your Company"
          />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-400"
              >
                И-мэйл хаяг
              </label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="tel" // Input type changed to "tel" for email numbers
                  autoComplete="tel"
                  required
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-400"
                >
                  Нууц үг
                </label>
              </div>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Remember me checkbox */}
            {/* <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Намайг сана
              </label>
            </div> */}

            {/* Error message */}
            {error && <div className="text-red-600 text-sm">{error}</div>}

            {/* Submit button */}
            <div>
              <button
                type="submit"
                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading} // Disable button when loading
              >
                {loading ? "Ачааллаж байна..." : "Нэвтрэх"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        className="lg:block lg:w-3/4 bg-cover bg-center"
        style={{ backgroundImage: 'url("/bg.jpg")' }}
      ></div>
    </div>
  );
}
