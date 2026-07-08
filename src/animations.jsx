import { motion, AnimatePresence } from 'framer-motion';

// Custom easing for that luxury, deliberate feel
const luxuryEasing = [0.16, 1, 0.3, 1];

// Global App Blur Reveal Wrapper
export const PageBlurReveal = ({ children }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, filter: 'blur(20px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 2.5, ease: luxuryEasing }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

// 1. Navbar: Slide down and fade in
export const FadeDownNav = ({ children }) => (
  <motion.div
    initial={{ y: '-100%', opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: luxuryEasing }}
  >
    {children}
  </motion.div>
);

// 2. Hero Headline: Staggered character reveal
export const StaggeredHeroTitle = ({ text }) => {
  // Split text by lines, then each line by characters for character-by-character reveal
  const lines = text.split('\\n');

  return (
    <motion.h1
      className="hero-title"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }, // Slower stagger for characters
      }}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} style={{ display: 'block' }}>
          {line.split(/(?!$)/u).map((char, charIndex) => (
            <motion.span
              key={`${lineIndex}-${charIndex}`}
              style={{ display: 'inline-block' }}
              variants={{
                hidden: { opacity: 0, filter: 'blur(10px)', y: 10 },
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

// 3. Hero Image/Subtitle: Slide up and fade in with delay
export const FadeUpHeroContent = ({ children, delay = 0.4 }) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, delay, ease: luxuryEasing }}
  >
    {children}
  </motion.div>
);

// 4. Scroll Reveal: For Product Cards (Staggered Grid)
const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: luxuryEasing } 
  },
};

export const FadeUpGridCard = ({ children, index = 0 }) => (
  <motion.article
    className="product-card"
    variants={cardVariants}
    initial="hidden"
    // Trigger when 15% in view, only once
    whileInView="visible"
    viewport={{ once: true, margin: "-15% 0px 0px 0px" }}
    // Stagger based on index
    transition={{ delay: index * 0.1 }}
  >
    {children}
  </motion.article>
);