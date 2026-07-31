import { motion } from "framer-motion";

const games = [
  {
    id: 1,
    name: "Among Us",
    category: "جماعية",
    image: "/images/among_us_1785476966426.png",
  },
  {
    id: 2,
    name: "المجتمع والأعمال",
    category: "إدارة وسيرفرات",
    image: "/images/discord_community_1785476977860.png",
  },
  {
    id: 3,
    name: "Discord Server",
    category: "مجتمع",
    image: "/images/discord_community_1785476977860.png",
  },
  {
    id: 4,
    name: "Roblox",
    category: "منصة ألعاب",
    image: "/images/roblox_1785476990464.png",
  },
  {
    id: 5,
    name: "Minecraft",
    category: "بقاء وإبداع",
    image: "/images/minecraft_1785477000813.png",
  },
  {
    id: 6,
    name: "ألعاب حركية",
    category: "قتال",
    image: "/images/action_games_1785477026311.png",
  },
  {
    id: 7,
    name: "Call of Duty",
    category: "تصويب",
    image: "/images/call_of_duty_1785477037054.png",
  },
  {
    id: 8,
    name: "عوالم افتراضية",
    category: "استكشاف",
    image: "/images/virtual_worlds_1785477047629.png",
  },
];

export function GamesGrid() {
  return (
    <section className="relative py-24 overflow-hidden t-bg-primary">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 t-text-primary"
        >
          ألعابك المفضلة، مدعومة بالكامل.
        </motion.h2>
        <p className="t-text-secondary text-lg max-w-2xl mx-auto">
          نحن نوفر بيئة متكاملة وسيرفرات مخصصة لأشهر الألعاب التنافسية والجماعية
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap gap-6 px-3">
          {[...games, ...games].map((game, i) => (
            <motion.div
              key={`${game.id}-${i}`}
              whileHover={{ scale: 1.05 }}
              className="relative w-72 h-48 md:w-80 md:h-56 rounded-2xl overflow-hidden cursor-pointer group/card border border-white/10"
            >
              {/* Image with grayscale filter by default, revealing slight color or brightness on hover */}
              <img 
                src={game.image} 
                alt={game.name} 
                className="absolute inset-0 w-full h-full object-cover grayscale-[100%] contrast-125 opacity-70 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-700"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
                <span className="inline-block px-2 py-1 bg-white/10 backdrop-blur-md rounded border border-white/20 text-white text-[10px] uppercase font-bold tracking-wider mb-2">
                  {game.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-1">{game.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
