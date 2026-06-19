import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/Redux/Auth/Action";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/Api/api";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [elapsed, setElapsed] = useState(0);

  // 🔥 Wake-up ping: as soon as the user opens the login page,
  // silently ping the backend so it starts warming up BEFORE they submit.
  useEffect(() => {
    fetch(`${API_BASE_URL}/`, { method: "GET", mode: "no-cors" }).catch(() => {});
  }, []);

  // Update the loading message as time passes so users understand the wait
  useEffect(() => {
    if (!isSubmitting) {
      setElapsed(0);
      setLoadingMsg("");
      return;
    }
    const messages = [
      { after: 0,  msg: "Connecting to server..." },
      { after: 4,  msg: "⏳ Server is starting up, please wait..." },
      { after: 15, msg: "🚀 Almost there, server is waking up..." },
      { after: 30, msg: "☕ Still starting... (Render free tier needs ~60s on first load)" },
      { after: 50, msg: "🔄 Nearly done, hang tight..." },
    ];
    let secs = 0;
    const interval = setInterval(() => {
      secs += 1;
      setElapsed(secs);
      const active = [...messages].reverse().find((m) => secs >= m.after);
      if (active) setLoadingMsg(active.msg);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    data.navigate = navigate;
    await dispatch(login(data));
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-5">
      <h1 className="text-center text-xl">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full py-5 relative"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>

          {/* Friendly progress message during cold start */}
          {isSubmitting && loadingMsg && (
            <div className="text-center space-y-2 pt-1">
              <p className="text-sm text-yellow-400 animate-pulse">{loadingMsg}</p>
              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-yellow-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((elapsed / 70) * 100, 95)}%` }}
                />
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
