import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0B1530] flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="w-16 h-16 mx-auto bg-[#D4AF37] rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-[#0B1530]">TF</span>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-serif font-bold text-[#D4AF37] mb-2"
        >
          Tax Filer
        </motion.h2>

        {/* Loading dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#D4AF37] rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
