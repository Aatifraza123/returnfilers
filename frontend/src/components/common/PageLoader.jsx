import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0B1530] flex items-center justify-center">
      <div className="text-center">
        {/* Logo with Spinner */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6 relative"
        >
          <div className="w-20 h-20 mx-auto bg-[#C9A227] rounded-xl flex items-center justify-center relative">
            <span className="text-3xl font-bold text-[#0B1530]">RF</span>
          </div>
          {/* Spinning border */}
          <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-[#C9A227] border-t-transparent rounded-xl animate-spin"></div>
        </motion.div>

        {/* Brand Name */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-serif font-bold text-[#C9A227]"
        >
          ReturnFilers
        </motion.h2>
      </div>
    </div>
  );
};

export default PageLoader;
