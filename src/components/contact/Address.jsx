import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Address = ({ item, index }) => {
  const [hover, setHover] = useState(false);
  
  const gradients = [
    "from-accent-pink to-medium-pink",
    "from-medium-pink to-dark-pink", 
    "from-dark-pink to-accent-pink"
  ];
  
  const delays = ["delay-100", "delay-200", "delay-300"];

  return (
    <div
      className={`group bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-gray-200/50 card-ultra cursor-pointer ${delays[index]} animate-scale-in relative overflow-hidden`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
      
      <div className="flex items-center space-x-4 relative z-10">
        <div
          className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-500 ${
            hover ? `bg-gradient-to-br ${gradients[index]} scale-110 shadow-lg` : "bg-gray-100 border-2 border-gray-200"
          }`}
        >
          <FontAwesomeIcon
            icon={item?.icon}
            className={`text-lg transition-colors duration-500 ${
              hover ? "text-white" : "text-gray-600"
            }`}
          />
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-1">
            {item?.title}
          </p>
          <p className="text-base text-gray-800 font-semibold group-hover:text-gray-900 transition-colors duration-300">
            {item?.description}
          </p>
        </div>
      </div>
      
      {/* Right arrow indicator */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className={`w-2 h-2 bg-gradient-to-br ${gradients[index]} rounded-full animate-bounce-slow`}></div>
      </div>
    </div>
  );
};

export default Address;
