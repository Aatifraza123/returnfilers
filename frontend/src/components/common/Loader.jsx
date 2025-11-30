import { motion } from 'framer-motion'

const Loader = ({ size = 'md', color = '#D4AF37' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  }

  return (
    <div className="flex justify-center items-center">
      <motion.div
        className={`${sizes[size] || sizes.md} border-4 rounded-full`}
        style={{
          borderColor: `${color}20`,
          borderTopColor: color,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export default Loader
