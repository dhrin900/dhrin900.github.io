const InformationSummary = ({ item, index }) => {
  const gradients = [
    "from-accent-pink to-medium-pink",
    "from-medium-pink to-dark-pink", 
    "from-dark-pink to-accent-pink"
  ];
  
  const delays = ["delay-100", "delay-200", "delay-300"];
  
  return (
    <div className={`group bg-white/95 backdrop-blur-md text-center rounded-3xl shadow-xl border border-gray-200/50 card-ultra ${delays[index]} animate-scale-in`}>
      <div className="px-6 py-8 relative overflow-hidden">
        {/* Background gradient animation */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
        
        {/* Floating decorative element */}
        <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${gradients[index]} rounded-full opacity-50 animate-bounce-slow`}></div>
        
        <div className="relative z-10">
          <p className="text-3xl xxs:text-4xl sm:text-5xl font-black text-gray-800 mb-3 group-hover:scale-110 transition-transform duration-300">
            <span className="text-gradient-ultra">{item.description}</span>
          </p>
          <p className="text-sm xxs:text-base sm:text-lg font-bold text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
            {item.title}
          </p>
        </div>
        
        {/* Bottom shine effect */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-medium-pink/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};

export default InformationSummary;
