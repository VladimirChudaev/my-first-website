'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const partners = [
  { name: "ПФКИ", logo: "https://vtagency.ru/wp-content/uploads/2025/05/53bfd55e-694b-446f-bad2-5b081ad53ddc.jpg", url: "https://xn--80aeeqaabljrdbg6a3ahhcl4ay9hsa.xn--p1ai/" },
  { name: "отв-челябинск", logo: "https://vtagency.ru/wp-content/uploads/2025/07/Телеканал-ОТВ_logo-на-подложке.png", url: "https://1obl.tv/" },
  { name: "Т-Плюс", logo: "https://vtagency.ru/wp-content/uploads/2024/08/image-28.png", url: "https://www.tplusgroup.ru/" },
  { name: "Новости Белгорода", logo: "https://vtagency.ru/wp-content/uploads/2025/05/изображение_2025-05-06_154046560.png", url: "https://www.belnovosti.ru/telekanal-belgorod-24/" },
  { name: "Музей победы", logo: "https://vtagency.ru/wp-content/uploads/2025/02/Музей_Победы_лого.jpg", url: "https://victorymuseum.ru/" },
  { name: "ОТС", logo: "https://vtagency.ru/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-30-at-11.52.57.jpeg", url: "https://otstv.ru/" },
  { name: "Тв-Севастополь", logo: "https://vtagency.ru/wp-content/uploads/2025/03/изображение_2025-03-06_165336337.png", url: "https://sevtrk.ru/" },
  { name: "ОТВ-Екатеринбург", logo: "https://vtagency.ru/wp-content/uploads/2025/03/изображение_2025-03-06_164456364.png", url: "https://obltv.ru/" },
  { name: "Тв-Югра", logo: "https://vtagency.ru/wp-content/uploads/2025/03/Снимок-экрана-2025-03-06-165139.png", url: "https://ugra-tv.ru/" },
  { name: "ТВ-СПб", logo: "https://vtagency.ru/wp-content/uploads/2025/04/spb_tv1_1.png", url: "https://tvspb.ru/" },
];

const doubledPartners = [...partners, ...partners];

export default function PartnersCarousel() { 
  return (
    <div className="bg-white py-12 overflow-hidden border-y border-gray-50">
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-gray-400 text-sm font-medium tracking-widest uppercase">Наши партнеры</h3>
      </div>
      
      <div className="relative flex">
        <motion.div
          className="flex flex-nowrap gap-16 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {doubledPartners.map((partner, index) => (
            <a
              key={index}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative shrink-0 block grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-16 w-auto object-contain"
              />
            </a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
