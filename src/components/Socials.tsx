"use client";

import { useState, memo } from "react";
import { motion } from "framer-motion";
import {
  RiMailFill,
  RiTelegramFill,
  RiInstagramFill,
  RiTwitterXFill,
  RiMediumFill
} from "@remixicon/react";

interface Social {
  id: string;
  title: string;
  username: string;
  link: string;
  icon: React.ElementType;
  color: string;
}

const socials: Social[] = [
  {
    id: "x",
    title: "X",
    username: "@harnitya29",
    link: "https://x.com/harnitya29",
    icon: RiTwitterXFill,
    color: "#ffffff",
  },
  {
    id: "telegram",
    title: "Telegram",
    username: "@007",
    link: "http://t.me/Harnitya",
    icon: RiTelegramFill,
    color: "#0077b5",
  },
  {
    id: "instagram",
    title: "Instagram",
    username: "harnityanarola29",
    link: "https://www.instagram.com/harnityanarola29",
    icon: RiInstagramFill,
    color: "#ff6600",
  },
  {
    id: "email",
    title: "Email",
    username: "Harnitya Narola",
    link: "mailto:narolaharnity@gmail.com",
    icon: RiMailFill,
    color: "#ea4335",
  },
  {
    id: "medium",
    title: "Medium",
    username: "@narolaharnity",
    link: "https://medium.com/@narolaharnity",
    icon: RiMediumFill,
    color: "#ffffff",
  },
];

const SocialTag = memo(({ 
  social, 
  isHovered, 
  onHoverStart, 
  onHoverEnd,
}: { 
  social: Social, 
  isHovered: boolean,
  onHoverStart: () => void,
  onHoverEnd: () => void,
}) => {
  return (
    <motion.a
      href={social.link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-flex items-center rounded-full px-4 py-2 mr-3 mb-4 backdrop-blur-sm group overflow-hidden cursor-pointer"
      style={{ 
        backgroundColor: isHovered ? `${social.color}15` : 'rgba(39, 39, 42, 0.3)',
        border: `1px solid ${isHovered ? social.color : 'rgba(63, 63, 70, 0.3)'}`,
        boxShadow: isHovered ? `0 0 15px ${social.color}40` : 'none',
      }}
      whileHover={{ 
        scale: 1.05,
        y: -2,
        transition: { type: "spring", stiffness: 300, damping: 15 }
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      // Added touch events for mobile "tap to open" feel
      onTouchStart={onHoverStart}
      onTouchEnd={() => setTimeout(onHoverEnd, 1000)}
    >
      <motion.div 
        className="mr-2 flex items-center justify-center relative z-10"
        animate={{ 
          scale: isHovered ? [1, 1.2, 1] : 1,
          rotate: isHovered ? [0, -10, 10, 0] : 0
        }}
        transition={{ duration: 0.5 }}
      >
        <social.icon 
          size={18} 
          style={{ 
            color: isHovered ? social.color : '#a1a1aa',
            filter: isHovered ? `drop-shadow(0 0 5px ${social.color})` : 'none'
          }} 
          className="transition-colors duration-300"
        />
      </motion.div>
      
      <span 
        className="text-xs font-mono font-medium relative z-10 transition-colors duration-300"
        style={{ color: isHovered ? '#f4f4f5' : '#a1a1aa' }}
      >
        {social.title}
      </span>
      
      <motion.span 
        className="overflow-hidden whitespace-nowrap inline-flex items-center"
        initial={{ width: 0, opacity: 0, marginLeft: 0 }}
        animate={{ 
          width: isHovered ? "auto" : 0, 
          opacity: isHovered ? 1 : 0,
          marginLeft: isHovered ? 8 : 0
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <span 
          className="text-[10px] opacity-80"
          style={{ color: social.color }}
        >
          {social.username}
        </span>
      </motion.span>
      
      {/* Background glow effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          style={{
            background: `radial-gradient(circle at center, ${social.color} 0%, transparent 70%)`
          }}
        />
      )}
    </motion.a>
  );
});

SocialTag.displayName = 'SocialTag';

export default function Socials() {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const handleHoverStart = (id: string) => setHoveredSocial(id);
  const handleHoverEnd = () => setHoveredSocial(null);

  return (
    <motion.div 
      className="mb-16 text-white relative will-change-transform"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      id="socials-section"
    >
      <motion.h1 
        className="text-2xl font-bold text-white relative inline-block mb-8"
        whileHover={{ scale: 1.03 }}
      >
        <motion.span
          className="text-violet-300 inline-block will-change-transform"
          animate={{
            rotate: [0, 5, 0, -5, 0],
            color: ['#a78bfa', '#c4b5fd', '#a78bfa'],
            textShadow: ['0 0 0px rgba(167, 139, 250, 0)', '0 0 10px rgba(167, 139, 250, 0.5)', '0 0 0px rgba(167, 139, 250, 0)']
          }}
          transition={{
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 5, 
            times: [0, 0.2, 0.5, 0.8, 1],
            repeatType: 'loop'
          }}
        >
          &gt;
        </motion.span>{" "}
        <span className="relative group">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-white bg-[length:200%_100%] animate-shimmer">links</span>
          <motion.span
            className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-violet-300/0 via-violet-300 to-violet-300/0 will-change-transform"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ boxShadow: '0 2px 10px rgba(167, 139, 250, 0.3)' }}
          />
        </span>
      </motion.h1>
      
      <motion.div 
        className="flex flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {socials.map((social) => (
          <SocialTag 
            key={social.id}
            social={social}
            isHovered={hoveredSocial === social.id}
            onHoverStart={() => handleHoverStart(social.id)}
            onHoverEnd={handleHoverEnd}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}