"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Copy, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import PageWrapper from "../(components)/PageWrapper";
import getAxiosErrorMessage from "../../utils/Variables/getAxiosError.util";
import CustomLoader from "../(components)/Components/utils/Loader";

export default function InviteCodeRafflePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const fetchRaffleToken = async () => {
    try {
      const response = await axios.post(
        "/api/public/invite-code-raffle",
        {},
        {
          responseType: "text",
        }
      );

      setToken(response.data);
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, "Failed to get token"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaffleToken();
  }, []);

  const copyToClipboard = () => {
    if (!token) return;

    navigator.clipboard.writeText(token);
    setCopied(true);
    toast.success("Copied!");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (loading) {
    return <CustomLoader fullscreen text="Loading random token ..." />;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen p-4">
        <div className="max-w-lg mx-auto mt-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Token Raffle
            </h1>
            <p className="text-gray-300">
              One code per 24 hours. It&apos;ll refresh when used
            </p>
          </motion.div>

          {/* Code Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-2xl p-6 shadow-2xl"
          >
            {/* Token Display */}
            <div className="mb-6">
              <div className="bg-black/60 border border-stone-700 rounded-xl p-4 text-center">
                <code className="font-mono text-white text-lg break-all">
                  {token || "No code available"}
                </code>
              </div>
            </div>

            {/* Sign Up Button */}
            {token && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 space-y-6"
              >
                {token && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copyToClipboard}
                    className="text-center flex items-center justify-center gap-2 w-full bg-black/40 backdrop-blur-sm border border-emerald-950 text-emerald-400 py-4 px-6 rounded-xl hover:border-emerald-500 hover:bg-emerald-500/20 transition-all duration-300 cursor-pointer"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-emerald-400 hover:text-emerald-400 transition-colors" />
                    )}{" "}
                    Copy
                  </motion.button>
                )}

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="/login"
                  className="text-center flex items-center justify-center gap-2 w-full bg-black/40 backdrop-blur-sm border border-stone-700 text-white py-4 px-6 rounded-xl hover:border-emerald-500 hover:bg-emerald-500/20 transition-all duration-300 cursor-pointer"
                >
                  Validate Token & Login
                </motion.a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
