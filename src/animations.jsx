import { motion } from 'framer-motion';

const luxuryEasing = [0.16, 1, 0.3, 1];

export const FadeDownNav = ({ children }) => (
  <motion.div
    initial={{ y: '-100%', opacity: 0, filter: 'blur(10px)' }}
    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
    transition={{ duration: 1.2, ease: luxuryEasing }}
  >
    {children}
  </motion.div>
);

export const StaggeredHeroTitle = ({ text }) => {
  const lines = text.split('\n');

  return (
    <motion.h1
      className="hero-title"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }, 
      }}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} style={{ display: 'block', overflow: 'hidden' }}>
          {line.split('').map((char, charIndex) => (
            <motion.span
              key={`${lineIndex}-${charIndex}`}
              style={{ display: 'inline-block' }}
              variants={{
                hidden: { 
                  opacity: 0, 
                  filter: 'blur(15px)',
                  y: 10 
                },
                visible: { 
                  opacity: 1, 
                  filter: 'blur(0px)',
                  y: 0,
                  transition: { duration: 1.2, ease: luxuryEasing } 
                },
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
};

export const FadeUpHeroContent = ({ children, delay = 0.4 }) => (
  <motion.div
    initial={{ y: 30, opacity: 0, filter: 'blur(15px)' }}
    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
    transition={{ duration: 1.5, delay, ease: luxuryEasing }}
  >
    {children}
  </motion.div>
);

const cardVariants = {
  hidden: { y: 30, opacity: 0, filter: 'blur(10px)' },
  visible: { 
    y: 0, 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: luxuryEasing } 
  },
};

export const FadeUpGridCard = ({ children, index = 0 }) => (
  <motion.article
    className="product-card"
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-15% 0px 0px 0px" }}
    transition={{ delay: index * 0.1 }}
  >
    {children}
  </motion.article>
);
