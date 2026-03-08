"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const getPhotos = () => {
  return [];
};

// Hàm định dạng ngày tháng theo dd/mm/yyyy
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function PhotosClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<{[key: string]: boolean}>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isChangingCategory, setIsChangingCategory] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  
  // Memoize danh sách ảnh để tránh tạo lại mỗi lần render
  const photos = useMemo(() => getPhotos(), []);
  
  // Lấy danh sách danh mục từ ảnh
  const categories = useMemo(() => 
    ["All", ...Array.from(new Set(photos.map(photo => photo.category)))], 
    [photos]
  );
  
  // Lọc ảnh theo danh mục
  const filteredPhotos = useMemo(() => 
    activeCategory === "All" 
      ? photos 
      : photos.filter(photo => photo.category === activeCategory),
    [activeCategory, photos]
  );
  
  // Xử lý khi ảnh load xong
  const handleImageLoaded = useCallback((id: string) => {
    setIsLoaded(prev => ({...prev, [id]: true}));
  }, []);

  // Xử lý khi chuyển danh mục
  const handleCategoryChange = useCallback((category: string) => {
    if (category !== activeCategory) {
      setIsChangingCategory(true);
      setTimeout(() => {
        setActiveCategory(category);
        setTimeout(() => {
          setIsChangingCategory(false);
        }, 100);
      }, 300);
    }
  }, [activeCategory]);

  // Theo dõi vị trí chuột - sửa lỗi scroll
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Chỉ cập nhật vị trí chuột khi người dùng thực sự di chuyển chuột
      // không phải khi scroll
      if (mainRef.current) {
        const rect = mainRef.current.getBoundingClientRect();
        
        // Lưu vị trí chuột trước đó
        const prevPosition = { ...mousePosition };
        const newPosition = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        
        // Chỉ cập nhật state nếu vị trí thay đổi đáng kể
        // Điều này giúp tránh re-render không cần thiết
        if (Math.abs(prevPosition.x - newPosition.x) > 5 || 
            Math.abs(prevPosition.y - newPosition.y) > 5) {
          setMousePosition(newPosition);
        }
      }
    };

    // Sử dụng throttle để giảm số lần gọi hàm handleMouseMove
    let throttleTimer: number | null = null;
    const throttledMouseMove = (e: MouseEvent) => {
      if (!throttleTimer) {
        throttleTimer = window.setTimeout(() => {
          handleMouseMove(e);
          throttleTimer = null;
        }, 50); // Chỉ xử lý tối đa 20 lần/giây
      }
    };

    window.addEventListener("mousemove", throttledMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      if (throttleTimer) window.clearTimeout(throttleTimer);
    };
  }, [mousePosition]);

  // Ngăn chặn hiệu ứng scroll không mong muốn
  useEffect(() => {
    // Lưu vị trí scroll hiện tại
    let lastScrollPosition = window.scrollY;
    
    const handleScroll = () => {
      // Không thực hiện bất kỳ thao tác nào khi scroll
      // Chỉ cập nhật vị trí scroll cuối cùng
      lastScrollPosition = window.scrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main 
      ref={mainRef} 
      className="relative min-h-screen text-white p-8 md:p-16 lg:p-24 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Enhanced cosmic background elements */}
      <div className="fixed inset-0 -z-10 bg-black pointer-events-none">
        <div className="absolute inset-0 bg-black pointer-events-none" />
        
        <motion.div 
          className="absolute top-0 left-0 w-full h-1 pointer-events-none"
          style={{
            background: "linear-gradient(to right, transparent, rgba(52, 211, 153, 0.3), transparent)",
          }}
          animate={{ 
            scaleX: [0, 1, 0],
            opacity: [0, 0.5, 0],
            x: ["-100%", "0%", "100%"]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-0 right-0 w-1 h-full pointer-events-none"
          style={{
            background: "linear-gradient(to top, transparent, rgba(52, 211, 153, 0.2), transparent)",
          }}
          animate={{ 
            scaleY: [0, 1, 0],
            opacity: [0, 0.3, 0],
            y: ["100%", "0%", "-100%"]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Animated particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-green-300/30 pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0.5],
              y: [0, -Math.random() * 100],
              x: [0, (Math.random() - 0.5) * 50],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Reactive glow effect that follows mouse - sửa để tránh reflow */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 -z-10"
          style={{
            background: "radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)",
            left: mousePosition.x - 250,
            top: mousePosition.y - 250,
            filter: "blur(50px)",
            willChange: "transform", // Tối ưu hiệu suất
            transform: "translateZ(0)" // Kích hoạt GPU acceleration
          }}
        />
      </div>

      <div className="flex-1 relative z-10">
        {/* Enhanced header with animated styling */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <motion.h1 
            className="text-5xl font-bold text-white relative inline-block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
          >
            <motion.span 
              className="text-green-300 inline-block"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              &gt;
            </motion.span>{" "}
            <span className="relative">
              photos
              <motion.span 
                className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-green-300/0 via-green-300 to-green-300/0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.7 }}
            className="text-gray-400 mt-3 max-w-xl"
          >
            My collection of photos, capturing special moments and interesting perspectives.
          </motion.p>
        </motion.div>

        {/* Danh mục với hiệu ứng chuyển đổi mượt mà */}
        <motion.div 
          className="flex flex-wrap gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden ${
                activeCategory === category 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-300'
              }`}
              onClick={() => handleCategoryChange(category)}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              {/* Hiệu ứng ripple khi click */}
              <motion.span
                className="absolute inset-0 bg-green-400/10 rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 1.5, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Nội dung danh mục */}
              <span className="relative z-10">{category}</span>
              
              {/* Hiệu ứng highlight khi hover */}
              {hoveredCategory === category && (
                <motion.span
                  layoutId="categoryHighlight"
                  className="absolute inset-0 rounded-full bg-green-500/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              {/* Hiệu ứng glow khi active */}
              {activeCategory === category && (
                <motion.span
                  className="absolute inset-0 rounded-full"
                  initial={{ boxShadow: "0 0 0 rgba(52, 211, 153, 0)" }}
                  animate={{ 
                    boxShadow: ["0 0 0px rgba(52, 211, 153, 0)", "0 0 10px rgba(52, 211, 153, 0.3)", "0 0 5px rgba(52, 211, 153, 0.2)"] 
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Grid ảnh với hiệu ứng chuyển đổi danh mục mượt mà */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ 
              willChange: "transform", // Tối ưu hiệu suất
              transform: "translateZ(0)" // Kích hoạt GPU acceleration
            }}
          >
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="relative overflow-hidden rounded-lg group"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    delay: index * 0.05 // Hiệu ứng stagger cho các ảnh
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.9, 
                  y: -20,
                  transition: { duration: 0.2 }
                }}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 0 25px rgba(52, 211, 153, 0.3)"
                }}
                onMouseEnter={() => setHoveredPhoto(photo.id)}
                onMouseLeave={() => setHoveredPhoto(null)}
                layout
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  {/* Hiệu ứng shimmer khi đang load */}
                  {!isLoaded[photo.id] && (
                    <div className="absolute inset-0 bg-zinc-800 rounded-lg overflow-hidden">
                      <motion.div
                        className="absolute inset-0 w-full h-full"
                        style={{
                          background: "linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.1), transparent)",
                        }}
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1.5,
                          ease: "linear"
                        }}
                      />
                    </div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ 
                      opacity: isLoaded[photo.id] ? 1 : 0,
                      scale: isLoaded[photo.id] ? 1 : 1.1,
                      transition: { duration: 0.5, ease: "easeOut" }
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover rounded-lg transition-all duration-700"
                      onLoad={() => handleImageLoaded(photo.id)}
                      priority={index < 9} // Ưu tiên 9 ảnh đầu tiên
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={90}
                      loading={index < 9 ? "eager" : "lazy"}
                      style={{
                        transform: hoveredPhoto === photo.id ? "scale(1.1)" : "scale(1)",
                        transition: "transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)"
                      }}
                    />
                  </motion.div>
                  
                  {/* Overlay thông tin với hiệu ứng cải tiến */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: hoveredPhoto === photo.id ? 1 : 0,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="flex justify-between items-end">
                      <motion.span 
                        className="text-xs font-medium px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-green-300 border border-green-500/20"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ 
                          y: hoveredPhoto === photo.id ? 0 : 20, 
                          opacity: hoveredPhoto === photo.id ? 1 : 0 
                        }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        {photo.category}
                      </motion.span>
                      <motion.span 
                        className="text-xs text-zinc-300 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ 
                          y: hoveredPhoto === photo.id ? 0 : 20, 
                          opacity: hoveredPhoto === photo.id ? 1 : 0 
                        }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        {formatDate(photo.date)}
                      </motion.span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Hiển thị thông báo khi không có ảnh nào trong danh mục */}
        {filteredPhotos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-300/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </motion.div>
            <p className="text-zinc-400 text-center">Không có ảnh nào trong danh mục này</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}