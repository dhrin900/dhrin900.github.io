import Roles from "./Roles";

const rolesData = [
  {
    id: 1,
    title: "User Experience (UX)",
    description:
      "I design intuitive and enjoyable experiences by understanding user needs, conducting research, and creating wireframes and prototypes that enhance usability.",
  },
  {
    id: 2,
    title: "User Interface (UI)",
    description:
      "I craft visually appealing and consistent interfaces, focusing on layout, color, and typography to ensure a seamless and engaging user journey.",
  },
  {
    id: 3,
    title: "Web Development",
    description:
      "I build responsive and high-performance web applications using modern technologies, ensuring accessibility, scalability, and maintainability.",
  },
];

const Profession = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-light-pink to-white relative overflow-hidden" id="services">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-accent-pink/5 to-medium-pink/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-medium-pink/5 to-dark-pink/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      
      <div className="content px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 max-lg:justify-center">
                <div className="w-16 h-1 bg-gradient-to-r from-accent-pink to-medium-pink rounded-full animate-shimmer"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-accent-pink to-medium-pink rounded-full animate-bounce-slow flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-medium-pink to-accent-pink rounded-full animate-shimmer"></div>
              </div>
              
              <h2 className="section-title font-black text-gray-800 max-lg:text-center">
                What <span className="bg-gradient-to-r from-accent-pink via-medium-pink to-dark-pink bg-clip-text text-transparent font-black" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: '#f8bbd9'}}>I do?</span>
              </h2>
              
              <div className="space-y-4 max-lg:text-center">
                <p className="text-lg text-gray-700 leading-relaxed">
                  I specialize in <span className="font-bold text-gradient">designing user experiences</span>, crafting engaging interfaces, and building robust web applications that deliver value and usability.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  My approach combines <span className="font-bold text-gradient">creativity and technical expertise</span> to deliver solutions that are both visually appealing and highly functional for users.
                </p>
              </div>
            </div>
            
            <div className="max-lg:text-center">
              <a
                href="mailto:babegirl33010@gmail.com"
                className="group btn-primary btn text-lg px-10 py-4 font-bold relative overflow-hidden"
              >
                <span className="relative z-10">💬 Let's Connect!</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </a>
            </div>
          </div>
          
          {/* Right Content - Services */}
          <div className="space-y-6">
            {rolesData.map((role, index) => (
              <Roles role={role} key={index} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profession;