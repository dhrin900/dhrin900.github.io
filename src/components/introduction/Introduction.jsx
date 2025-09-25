import person from "../../assets/profile.jpg";
import "./introduction.css";
import InformationSummary from "./InformationSummary";

// Information summary data
const informationSummaryData = [
  {
    id: 1,
    title: "Projects",
    description: "25+",
  },
  {
    id: 2,
    title: "Technologies",
    description: "10+",
  },
  {
    id: 3,
    title: "UI Designs",
    description: "50+",
  },
];

const Introduction = () => {
  return (
    <div
      className="flex max-lg:flex-col-reverse sm:justify-between pt-20 lg:pt-32 lg:mb-20 max-xl:gap-8 p-4 max-xxl:px-8 min-h-screen items-center relative overflow-hidden"
      id="introduction"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-accent-pink/20 to-medium-pink/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-medium-pink/10 to-light-pink/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-br from-accent-pink/30 to-transparent rounded-full blur-2xl animate-bounce-slow"></div>
      </div>

      <div className="w-full flex flex-col justify-center max-lg:text-center space-y-8 relative z-10 -mt-24 lg:-mt-32">
        <div className="space-y-8 animate-slide-left">
          <div className="space-y-6">
            <div className="flex items-center gap-3 max-lg:justify-center">
              <div className="w-12 h-1 bg-gradient-to-r from-accent-pink to-medium-pink rounded-full animate-shimmer"></div>
              <p className="text-lg font-semibold text-gray-600 tracking-wide animate-glow">
                👋 Hello, I'm
              </p>
            </div>
            
            <h1 className="text-5xl xxs:text-6xl sm:text-7xl xl:text-8xl font-black text-gray-800 leading-tight relative">
              <span className="bg-gradient-to-r from-accent-pink via-medium-pink to-dark-pink bg-clip-text text-transparent font-black" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: '#f8bbd9'}}>DH Rin</span>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-accent-pink to-medium-pink rounded-full animate-bounce-slow opacity-80"></div>
            </h1>
            
            <div className="relative">
              <h2 className="text-xl xxs:text-2xl lg:text-3xl font-bold text-gray-700 leading-relaxed">
                <span className="relative">
                  Java Developer
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-accent-pink/50 to-transparent rounded-full"></div>
                </span>
                {" | "}
                <span className="text-gradient relative">
                  UI/UX Design Enthusiast
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-medium-pink/50 to-transparent rounded-full"></div>
                </span>
                {" | "}
                <span className="text-gradient relative">
                  Figma Designer
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-dark-pink/50 to-transparent rounded-full"></div>
                </span>
              </h2>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-accent-pink to-medium-pink rounded-full opacity-50"></div>
            <p className="text-base xxs:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 pl-8">
              I'm a passionate Java Developer, UI/UX Design Enthusiast, and Figma Designer studying at 
              <span className="font-bold text-gradient relative">
                Asia-Pacific International University
                <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-medium-pink to-transparent"></div>
              </span>. 
              I live in <span className="font-bold text-gradient relative">
                Bangkok, Thailand
                <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-accent-pink to-transparent"></div>
              </span>, where I combine my passion 
              for coding and design to create impactful digital experiences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-8">
            <a
              className="group btn-primary btn text-lg px-10 py-4 font-bold relative overflow-hidden"
              href="#portfolio"
            >
              <span className="relative z-10">✨ View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </a>
            <a
              className="group btn-secondary btn text-lg px-10 py-4 font-bold relative overflow-hidden"
              href="mailto:babegirl33010@gmail.com"
            >
              <span className="relative z-10">💬 Say Hello!</span>
              <div className="absolute inset-0 bg-gradient-to-r from-medium-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </a>
          </div>
        </div>
        
        <div className="mx-auto lg:mx-0 lg:-ml-24 animate-scale-in -mt-12">
          <div className="grid grid-cols-3 gap-4 mt-8 scale-75">
            {informationSummaryData.map((item, index) => (
              <InformationSummary key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-md lg:max-w-lg w-full h-full max-lg:mx-auto relative animate-slide-right -mt-20 lg:-mt-28">
        <div className="relative group">
          {/* Animated background rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-pink/30 to-medium-pink/30 animate-pulse-slow scale-110"></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-medium-pink/20 to-dark-pink/20 animate-float scale-105"></div>
          
          {/* Main image container */}
          <div className="relative z-10 card-morphism p-2">
            <img
              className="relative w-full h-full object-cover rounded-3xl transform group-hover:scale-105 transition-transform duration-700 shadow-2xl"
              src={person}
              alt="DH Rin - Java Developer and UI/UX Designer"
            />
            
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-accent-pink to-medium-pink text-white px-4 py-2 rounded-2xl font-bold text-sm animate-bounce-slow shadow-lg">
              🚀 Available
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-md text-gray-800 px-4 py-2 rounded-2xl font-bold text-sm animate-float shadow-lg border border-medium-pink/20">
              🎆 Creative
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;