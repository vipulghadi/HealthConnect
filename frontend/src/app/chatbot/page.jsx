"use client";

import { motion } from "framer-motion";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="w-full shadow-xl rounded-2xl border-2 border-blue-300 bg-gradient-to-b from-blue-50 to-white p-6 space-y-6">
          <motion.div
            animate={{
              y: [0, -5, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            }}
            className="flex justify-center"
          >
            <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
              🧊 AI Psychologist Chatbot 🧠
            </h1>
          </motion.div>

          <Chatbot />
        </div>
      </motion.div>
    </div>
  );
}
