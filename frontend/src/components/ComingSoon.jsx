// src/components/ComingSoon.jsx
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

const ComingSoon = () => {
  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 font-sans">
      <motion.div
        className="text-center bg-white p-12 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <FaGraduationCap
          size={80}
          className="text-blue-500 mx-auto mb-6"
        />

        <motion.h1
          className="text-4xl font-bold text-gray-800"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          Coming Soon...
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Our education platform is launching soon. Stay tuned!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
