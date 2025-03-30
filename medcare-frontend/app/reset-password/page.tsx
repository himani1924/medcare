'use client'
import { useState } from "react";
import styles from '@/styles/resetpassword.module.css'
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ResetPassword = () => {

    const router = useRouter()
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [otp, setOtp] = useState("");
    const [otpMessage, setOtpMessage] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);
    
    const [newPassword, setNewPassword] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);


    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setOtpMessage("");

        try {
            const response = await fetch("http://localhost:5000/api/v1/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Check your email for OTP. valid for only 5 minutes");
                setShowOtpInput(true); 
            } else {
                setError(data.error || "Failed to send OTP.");
            }
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        }
    };

    
    const verifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setOtpMessage("");

        try {
            const response = await fetch("http://localhost:5000/api/v1/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();
            if (response.ok) {
                setOtpMessage("OTP verified successfully. Enter your new password.");
                setOtpVerified(true);
                setShowPasswordInput(true);
            } else {
                setOtpMessage(data.error || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setOtpMessage("Something went wrong. Please try again.");
        }}

        const resetPassword = async (e: React.FormEvent) => {
            e.preventDefault();
    
            try {
                const response = await fetch("http://localhost:5000/api/v1/auth/reset-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, newPassword }),
                });
    
                const data = await response.json();
                if (response.ok) {
                    toast.success("Password reset successfully! Redirecting to login...");
                setTimeout(() => {
                    router.push("/login"); 
                }, 2000);
                } else {
                    toast.error('Failed to update password')
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong. Please try again.");
            }
        };

    return (
        <div className={styles.container}>
            <h2 className={styles.h2}>Reset Password</h2>

            <form onSubmit={handleReset}>
                <input
                    type="email"
                    className={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className={styles.button} type="submit">Reset Password</button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
            {error && <p className={styles.error}>{error}</p>}

            {showOtpInput && !otpVerified && (
                <form onSubmit={verifyOtp}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button className={styles.button} type="submit">Verify OTP</button>
                </form>
            )}
            {otpMessage && <p className={otpMessage.includes("successfully") ? styles.message : styles.error}>{otpMessage}</p>}
            {showPasswordInput && (
                <form onSubmit={resetPassword}>
                    <input
                        type="password"
                        className={styles.input}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button className={styles.button} type="submit">Set New Password</button>
                </form>
            )}
        </div>
    );
};

export default ResetPassword;
