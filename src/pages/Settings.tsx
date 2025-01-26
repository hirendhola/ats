import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMoon, FiSun, FiBell, FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { theme } from "@/theme/theme";

export const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  const toggleSetting = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prev) => !prev);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-background text-text"
      } transition-colors duration-300`}
      style={{ fontFamily: theme.fonts.body }}
    >
      <div className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 text-center"
          style={{ fontFamily: theme.fonts.heading }}
        >
          Settings
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-large p-6 max-w-md mx-auto"
        >
          <div className="space-y-6">
            <SettingToggle
              icon={darkMode ? FiMoon : FiSun}
              title="Dark Mode"
              isActive={darkMode}
              toggle={() => toggleSetting(setDarkMode)}
            />

            <SettingToggle
              icon={FiBell}
              title="Notifications"
              isActive={notifications}
              toggle={() => toggleSetting(setNotifications)}
            />

            <SettingToggle
              icon={privacyMode ? FiEyeOff : FiEye}
              title="Privacy Mode"
              isActive={privacyMode}
              toggle={() => toggleSetting(setPrivacyMode)}
            />
          </div>

          <Button className="mt-8 w-full">Save Changes</Button>
        </motion.div>
      </div>
    </div>
  );
};

const SettingToggle: React.FC<{
  icon: React.ElementType;
  title: string;
  isActive: boolean;
  toggle: () => void;
}> = ({ icon: Icon, title, isActive, toggle }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Icon className={isActive ? "text-primary" : "text-textLight"} />
        <span className="font-medium">{title}</span>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggle}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
          isActive ? "bg-primary" : "bg-gray-300"
        }`}
      >
        <motion.div
          className="bg-white w-4 h-4 rounded-full shadow-md"
          animate={{ x: isActive ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        />
      </motion.button>
    </div>
  );
};
