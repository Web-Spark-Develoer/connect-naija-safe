import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Heart, MessageCircle, User } from "lucide-react";

const navItems = [
  { path: "/discover", icon: Flame, label: "Discover" },
  { path: "/likes", icon: Heart, label: "Likes" },
  { path: "/messages", icon: MessageCircle, label: "Messages", badge: 3 },
  { path: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on auth pages
  if (["/", "/login", "/signup", "/welcome", "/forgot-password"].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -inset-2 rounded-2xl bg-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-6 w-6 transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                {item.badge && (
                  <span className="match-badge">{item.badge}</span>
                )}
              </div>
              <span
                className={`mt-1 text-xs transition-colors duration-200 ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
