'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';

const videos = [
  {
    title: "Проект 'Руки'",
    cover: "https://vtagency.ru/wp-content/uploads/2025/07/Frame-180.png",
    url: "https://rutube.ru/video/3e049c66ee5e6598996db3a083a86540/",
  },
  {
    title: "Фильм о фильме (День театра)",
    cover: "https://vtagency.ru/wp-content/uploads/2025/05/Frame-174.png",
    url: "https://rutube.ru/video/f7236d5eba5fc6c560d51efb4da6be7/",
  },
  {
    title: "Поздравление (День театра)",
    /* ОБНОВЛЕННАЯ ССЫЛКА НА ОБЛОЖКУ */
    cover: "https://vtagency.ru/wp-content/uploads/2025/03/Frame-159.png", 
    url: "https://rutube.ru/video/697f84970dfbc137a0a6d4dc88833a91/",
  },
  {
    title: "Карл Айхингер",
    cover: "https://vtagency.ru/wp-content/uploads/2025/03/Frame-157-1.png",
    url: "https://rutube.ru/video/8939de9e366c2064feac69681c54b29f/",
  },
  {
    title: "Агитбригада",
    cover: "https://vtagency.ru/wp-content/uploads/2025/03/Frame-153-1.png",
    url: "https://rutube.ru/video/0e8ebff0f52e1b89f2dccc23ba7deb37/",
  },
  {
    title: "Угрюмка тизер",
    cover: "https://vtagency.ru/wp-content/uploads/2025/03/Frame-152.png",
    url: "https://rutube.ru/video/550cf890df3c44b96e64582c84a7d1d2/",
  },
  {
    title: "Агитбригада фильм о фильме",
    cover: "https://vtagency.ru/wp-content/uploads/2025/03/Frame-154.png",
    url: "https://rutube.ru/video/2534df451f31338409cec4d5fe0c5a9f/",
  },
  {
    title: "Работает лифт!",
    cover: "https://vtagency.ru/wp-content/uploads/2025/03/Frame-156.png",
    url: "https://rutube.ru/video/98dc22b8f7bba68fcdddfc1468caea7e/",
  },
  {
    title: "Валенки Деда Мороза",
    cover: "https://vtagency.ru/wp-content/uploads/2024/09/Frame-124.png",
    url: "https://rutube.ru/video/ce0ca8ce4085bbbde2c4dcb9dfba11b5/",
  },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function VideoCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);
  const videosPerPage = 3; 
  const mobileVideosPerPage = 1;
  const tabletVideosPerPage = 2;

  const getVideosPerPage = () => {
    if (typeof window === 'undefined') return videosPerPage;
    if (window.innerWidth < 768) return mobileVideosPerPage;
    if (window.innerWidth < 1024) return tabletVideosPerPage;
    return videosPerPage;
  };

  const [currentVideosPerPage, setCurrentVideosPerPage] = useState(getVideosPerPage());

  useEffect(() => {
    const handleResize = () => {
      setCurrentVideosPerPage(getVideosPerPage());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(videos.length / currentVideosPerPage);
  const videoStartIndex = page * currentVideosPerPage;
  const currentVideoSlice = videos.slice(videoStartIndex, videoStartIndex + currentVideosPerPage);

  const paginate = (newDirection: number) => {
    setPage((prevPage) => {
      const newPage = prevPage[0] + newDirection;
      return [wrap(0, totalPages, newPage), newDirection];
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [page, totalPages]);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 mb-8">
        <div className="relative">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            {currentVideoSlice.map((video, index) => (
              <motion.a
                key={index}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block group overflow-hidden rounded-lg shadow-lg aspect-video bg-black"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={video.cover}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaPlay className="text-white text-5xl opacity-80" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white hidden">
                  <h3 className="text-sm md:text-base font-medium">{video.title}</h3>
                </div>
              </motion.a>
            ))}
          </motion.div>

          <div
            className="absolute top-1/2 -translate-y-1/2 -left-4 md:left-4 cursor-pointer text-gray-800 text-2xl p-3 rounded-full bg-white/50 hover:bg-white/75 shadow-md transition-colors z-10 hidden md:block"
            onClick={() => paginate(-1)}
          >
            {"<"}
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 -right-4 md:right-4 cursor-pointer text-gray-800 text-2xl p-3 rounded-full bg-white/50 hover:bg-white/75 shadow-md transition-colors z-10 hidden md:block"
            onClick={() => paginate(1)}
          >
            {">"}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-10">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                idx === page ? 'bg-gray-800 scale-125' : 'bg-gray-300'
              }`}
              onClick={() => setPage([idx, idx > page ? 1 : -1])}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};