import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"; // فرض می‌کنیم استایل‌ها در همین فایل قرار دارند

export default function ForgetPassword() {
  const [emailSent, setEmailSent] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email("ایمیل معتبر نیست").required("ایمیل ضروری است"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3001/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      if (!response.ok) {
        throw new Error("ارسال ایمیل با خطا مواجه شد");
      }

      setEmailSent(true);
      toast.success("ایمیل بازیابی رمز عبور ارسال شد");
    } catch (error) {
      console.error("Forget password error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="forget-password-box">
      <h2>فراموشی رمز عبور</h2>
      {emailSent ? (
        <p>لطفاً ایمیل خود را بررسی کنید</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <div className="input-container">
              <i className="fas fa-envelope icon"></i>
              <input
                type="email"
                {...register("email")}
                placeholder="ایمیل"
                className={errors.email ? "error" : ""}
                required
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
          </div>
          <button type="submit" className="gaming-button">ارسال</button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
}
