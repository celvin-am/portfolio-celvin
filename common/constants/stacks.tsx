import { BsRobot } from "react-icons/bs";
import { 
  TbDeviceComputerCamera, 
  TbDrone, 
  TbBrandNextjs 
} from "react-icons/tb";
import { 
  MdSensors, 
  MdOutlineSettingsRemote, 
  MdFlightTakeoff,
  MdOutlineCloudQueue 
} from "react-icons/md";
import {
  SiPython,
  SiCplusplus,
  SiArduino,
  SiRos,
  SiOpencv,
  SiPytorch,
  SiFastapi,
  SiLinux,
  SiFirebase,
  SiGithub,
  SiSupabase,
  SiNextdotjs,
  SiTailwindcss,
  SiRaspberrypi,
  SiNvidia,
  SiVite, 
  SiReact, 
  SiTypescript, 
  SiPostgresql, 
  SiExpress,
  SiDrizzle
} from "react-icons/si";

export type SkillProps = {
  [key: string]: {
    icon: JSX.Element;
    background: string;
    color: string;
    isActive?: boolean;
  };
};

const iconSize = 24;

export const STACKS: SkillProps = {
  // 1️⃣ BAHASA PEMROGRAMAN
  Python: {
    icon: <SiPython size={iconSize} />,
    background: "bg-blue-500",
    color: "text-blue-500",
    isActive: true,
  },
  // Fix: Tambahin key "C++" biar sinkron sama inputan lu
  "C++": {
    icon: <SiCplusplus size={iconSize} />,
    background: "bg-blue-700",
    color: "text-blue-700",
    isActive: false,
  },
  "C/C++": {
    icon: <SiCplusplus size={iconSize} />,
    background: "bg-blue-700",
    color: "text-blue-700",
    isActive: true,
  },

  // 2️⃣ KECERDASAN BUATAN & COMPUTER VISION
  PyTorch: {
    icon: <SiPytorch size={iconSize} />,
    background: "bg-orange-500",
    color: "text-orange-500",
    isActive: true,
  },
  OpenCV: {
    icon: <SiOpencv size={iconSize} />,
    background: "bg-red-500",
    color: "text-red-500",
    isActive: true,
  },
  YOLO: {
    icon: <TbDeviceComputerCamera size={iconSize} />,
    background: "bg-emerald-500",
    color: "text-emerald-500",
    isActive: true,
  },

  // 3️⃣ SISTEM ROBOTIKA & UAV
  ROS2: {
    icon: <SiRos size={iconSize} />,
    background: "bg-slate-800",
    color: "text-slate-800",
    isActive: true,
  },
  ArduPilot: {
    icon: <TbDrone size={iconSize} />,
    background: "bg-sky-600",
    color: "text-sky-600",
    isActive: true,
  },
  "UAV Pilot": {
    icon: <MdFlightTakeoff size={iconSize} />,
    background: "bg-indigo-500",
    color: "text-indigo-500",
    isActive: true,
  },
  Gazebo: {
    icon: <BsRobot size={iconSize} />,
    background: "bg-orange-600",
    color: "text-orange-600",
    isActive: true,
  },
  LIDAR: {
    icon: <MdSensors size={iconSize} />,
    background: "bg-green-500",
    color: "text-green-500",
    isActive: true,
  },
  Telemetri: {
    icon: <MdOutlineSettingsRemote size={iconSize} />,
    background: "bg-sky-500",
    color: "text-sky-500",
    isActive: true,
  },

  // 4️⃣ PERANGKAT KERAS (HARDWARE)
  "NVIDIA Jetson": {
    icon: <SiNvidia size={iconSize} />,
    background: "bg-green-600",
    color: "text-green-600",
    isActive: true,
  },
  "Raspberry Pi": {
    icon: <SiRaspberrypi size={iconSize} />,
    background: "bg-rose-600",
    color: "text-rose-600",
    isActive: true,
  },
  // Fix: Tambahin key "Arduino" biar sinkron sama inputan lu
  Arduino: { 
    icon: <SiArduino size={iconSize} />,
    background: "bg-teal-600",
    color: "text-teal-600",
    isActive: false,
  },
  Microcontrollers: { 
    icon: <SiArduino size={iconSize} />,
    background: "bg-teal-600",
    color: "text-teal-600",
    isActive: true,
  },
  // Fix: Tambahin IoT biar deskripsi IoT lu ada icon-nya
  IoT: {
    icon: <MdOutlineCloudQueue size={iconSize} />,
    background: "bg-emerald-500",
    color: "text-emerald-500",
    isActive: true,
  },

  // 5️⃣ INFRASTRUKTUR & TOOLS
  Linux: {
    icon: <SiLinux size={iconSize} />,
    background: "bg-yellow-500",
    color: "text-yellow-500",
    isActive: true,
  },
  FastAPI: {
    icon: <SiFastapi size={iconSize} />,
    background: "bg-emerald-600",
    color: "text-emerald-600",
    isActive: true,
  },
  Github: {
    icon: <SiGithub size={iconSize} />,
    background: "bg-slate-800",
    color: "text-neutral-500",
    isActive: true,
  },

  // 6️⃣ WEB STACK
  "Next.js": {
    icon: <SiNextdotjs size={iconSize} />,
    background: "bg-neutral-800",
    color: "text-neutral-800 dark:text-neutral-200",
    isActive: true,
  },
  TailwindCSS: {
    icon: <SiTailwindcss size={iconSize} />,
    background: "bg-sky-400",
    color: "text-sky-400",
    isActive: true,
  },
  Firebase: {
    icon: <SiFirebase size={iconSize} />,
    background: "bg-amber-500",
    color: "text-amber-500",
    isActive: true,
  },
  Supabase: {
    icon: <SiSupabase size={iconSize} />,
    background: "bg-emerald-500",
    color: "text-emerald-500",
    isActive: true,
  },

  Vite: {
    icon: <SiVite size={iconSize} />,
    background: "bg-purple-500",
    color: "text-purple-500",
    isActive: false,
  },
  React: {
    icon: <SiReact size={iconSize} />,
    background: "bg-blue-400",
    color: "text-blue-400",
    isActive: true,
  },
  TypeScript: {
    icon: <SiTypescript size={iconSize} />,
    background: "bg-blue-600",
    color: "text-blue-600",
    isActive: false,
  },
  "Drizzle ORM": {
    icon: <SiDrizzle size={iconSize} />,
    background: "bg-lime-400",
    color: "text-lime-400",
    isActive: false,
  },
  PostgreSQL: {
    icon: <SiPostgresql size={iconSize} />,
    background: "bg-blue-800",
    color: "text-blue-800",
    isActive: false,
  },
  Express: {
    icon: <SiExpress size={iconSize} />,
    background: "bg-neutral-500",
    color: "text-neutral-500",
    isActive: true,
  },

};