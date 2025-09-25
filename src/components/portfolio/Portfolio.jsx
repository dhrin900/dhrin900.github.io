import Projects from "./Projects";

// Since we're showing "Coming Soon", we don't need the project data imports
// const projectData = [];

// Project data removed since we're showing "Coming Soon" section

const Portfolio = () => {
  return (
    <section
      className="py-24 bg-white relative overflow-hidden"
      id="portfolio"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-accent-pink/5 to-medium-pink/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-medium-pink/5 to-dark-pink/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      
      <div className="content px-4 relative z-10">
        <div className="text-center mb-20 animate-fadeInUp">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-1 bg-gradient-to-r from-accent-pink to-medium-pink rounded-full animate-shimmer"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-accent-pink to-medium-pink rounded-full animate-bounce-slow flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-medium-pink to-accent-pink rounded-full animate-shimmer"></div>
          </div>
          
          <h2 className="section-title font-black text-gray-800 mb-8">
            My <span className="bg-gradient-to-r from-accent-pink via-medium-pink to-dark-pink bg-clip-text text-transparent font-black" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: '#f8bbd9'}}>Portfolio</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-16">
            I'm currently working on some <span className="font-bold text-gradient">exciting projects</span> that showcase my skills in
            Java development, UI/UX design, and creating user-centric digital experiences.
          </p>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-16 border border-gray-200/50 shadow-2xl relative overflow-hidden animate-scale-in">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-8 left-8 w-16 h-16 border-2 border-medium-pink rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
                <div className="absolute bottom-8 right-8 w-12 h-12 border-2 border-accent-pink rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-medium-pink/30 rounded-full animate-pulse-slow"></div>
              </div>
              
              <div className="text-center space-y-8 relative z-10">
                <div className="relative">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-accent-pink to-medium-pink rounded-full flex items-center justify-center mb-8 animate-glow shadow-2xl">
                    <svg className="w-16 h-16 text-white animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  
                  {/* Floating decorative elements */}
                  <div className="absolute -top-4 -left-4 w-6 h-6 bg-gradient-to-br from-accent-pink to-medium-pink rounded-full animate-float opacity-60"></div>
                  <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-gradient-to-br from-medium-pink to-dark-pink rounded-full animate-bounce-slow opacity-80"></div>
                </div>
                
                <h3 className="text-4xl font-black text-gray-800 mb-6">
                  Portfolio <span className="bg-gradient-to-r from-accent-pink via-medium-pink to-dark-pink bg-clip-text text-transparent font-black" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: '#f8bbd9'}}>Coming Soon</span>
                  <div className="w-24 h-1 bg-gradient-to-r from-accent-pink to-medium-pink mx-auto mt-4 rounded-full animate-pulse-slow"></div>
                </h3>
                
                <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
                  I'm putting the finishing touches on some <span className="font-bold text-gradient">amazing projects</span> that I can't wait to share with you.
                  From innovative Java applications to stunning UI/UX designs, <span className="font-bold text-gradient">exciting work is on the way!</span>
                </p>
                
                {/* Progress indicators */}
                <div className="flex justify-center space-x-4 mb-8">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-pink to-medium-pink flex items-center justify-center animate-pulse-slow">
                      <span className="text-white font-bold text-sm">85%</span>
                    </div>
                    <span className="text-xs text-gray-700 font-medium">Java Projects</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-medium-pink to-dark-pink flex items-center justify-center animate-pulse-slow" style={{animationDelay: '0.5s'}}>
                      <span className="text-white font-bold text-sm">92%</span>
                    </div>
                    <span className="text-xs text-gray-700 font-medium">UI Designs</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-dark-pink to-accent-pink flex items-center justify-center animate-pulse-slow" style={{animationDelay: '1s'}}>
                      <span className="text-white font-bold text-sm">78%</span>
                    </div>
                    <span className="text-xs text-gray-700 font-medium">Prototypes</span>
                  </div>
                </div>
                
                <div className="pt-6">
                  <a
                    href="#contact"
                    className="group btn-primary btn text-lg px-12 py-4 font-bold relative overflow-hidden"
                  >
                    <span className="relative z-10">📧 Get Notified When Ready</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </a>
                </div>
              </div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r from-accent-pink via-medium-pink to-dark-pink opacity-20 animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
