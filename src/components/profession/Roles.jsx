import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faCode, faDesktop } from "@fortawesome/free-solid-svg-icons";

const Roles = ({ role, index }) => {
  const [mouseHover, setMouseHover] = useState(false);
  
  const icons = [faPalette, faDesktop, faCode];
  const gradients = [
    "from-accent-pink to-medium-pink",
    "from-medium-pink to-dark-pink", 
    "from-dark-pink to-accent-pink"
  ];
  
  const delays = ["delay-100", "delay-200", "delay-300"];

  return (
    <div
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
      className={`group bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200/50 card-ultra ${delays[index]} animate-scale-in relative overflow-hidden`}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-5 transition-opacity duration-700 rounded-3xl`}></div>
      
      {/* Animated left border */}
      <div className={`absolute left-0 top-0 w-1 h-0 bg-gradient-to-b ${gradients[index]} transition-all duration-500 ${mouseHover ? 'h-full' : 'h-0'}`}></div>
      
      {/* Floating particles */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-medium-pink rounded-full animate-bounce-slow opacity-60"></div>
      
      <div className="flex items-start space-x-6 relative z-10">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl flex-shrink-0`}>
          <FontAwesomeIcon 
            icon={icons[index]} 
            className="text-white text-2xl"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-black text-gray-800 group-hover:text-gradient transition-all duration-500">
            {role?.title}
          </h3>
          <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
            {role?.description}
          </p>
        </div>
      </div>
      
      {/* Bottom shine effect */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-medium-pink/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating badge */}
      <div className="absolute -top-3 -right-3 bg-gradient-to-br from-accent-pink to-medium-pink text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce-slow">
        ✨ Expertise
      </div>
    </div>
  );
};

export default Roles;