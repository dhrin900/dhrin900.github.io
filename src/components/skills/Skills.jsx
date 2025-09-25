import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faJava, 
  faFigma, 
  faReact, 
  faJs 
} from "@fortawesome/free-brands-svg-icons";
import { 
  faPalette, 
  faCode, 
  faDesktop,
  faMobile
} from "@fortawesome/free-solid-svg-icons";

const skillsData = [
  {
    id: 1,
    title: "Java Development",
    description: "Backend development with Spring Boot, REST APIs, and microservices architecture.",
    icon: faJava,
    color: "from-orange-400 to-red-500"
  },
  {
    id: 2,
    title: "UI/UX Design",
    description: "User-centered design, wireframing, prototyping, and design systems.",
    icon: faPalette,
    color: "from-pink-400 to-purple-500"
  },
  {
    id: 3,
    title: "Figma Design",
    description: "Professional design tools, component libraries, and collaborative design.",
    icon: faFigma,
    color: "from-purple-400 to-pink-500"
  },
  {
    id: 4,
    title: "Frontend Development",
    description: "React, JavaScript, responsive design, and modern web technologies.",
    icon: faReact,
    color: "from-blue-400 to-cyan-500"
  },
  {
    id: 5,
    title: "Web Design",
    description: "Modern, responsive websites with clean aesthetics and great UX.",
    icon: faDesktop,
    color: "from-green-400 to-blue-500"
  },
  {
    id: 6,
    title: "Mobile Design",
    description: "Mobile-first design approach and cross-platform user experiences.",
    icon: faMobile,
    color: "from-indigo-400 to-purple-500"
  }
];

const SkillCard = ({ skill, index }) => {
  const delays = ["delay-75", "delay-150", "delay-225", "delay-300", "delay-375", "delay-450"];
  
  return (
    <div className={`group bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200/50 card-ultra ${delays[index]} animate-scale-in relative overflow-hidden`}>
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-5 transition-opacity duration-700 rounded-3xl`}></div>
      
      {/* Floating particles */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-medium-pink rounded-full animate-bounce-slow opacity-60"></div>
      <div className="absolute bottom-6 left-6 w-1 h-1 bg-accent-pink rounded-full animate-pulse-slow opacity-80"></div>
      
      <div className="text-center space-y-6 relative z-10">
        <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${skill.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-2xl animate-glow`}>
          <FontAwesomeIcon
            icon={skill.icon} 
            className="text-white text-4xl animate-pulse-slow"
          />
        </div>
        
        <h3 className="text-2xl font-black text-gray-800 group-hover:text-gradient-ultra transition-all duration-500">
          {skill.title}
        </h3>
        
        <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
          {skill.description}
        </p>
        
        {/* Progress bar effect */}
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${skill.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left`}></div>
        </div>
      </div>
      
      {/* Floating badge */}
      <div className="absolute -top-3 -right-3 bg-gradient-to-br from-accent-pink to-medium-pink text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce-slow">
        ✨ Expert
      </div>
    </div>
  );
};

const Skills = () => {
  return (
    <section className="pt-32 pb-20 gradient-mesh relative overflow-hidden" id="skills">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-accent-pink/10 to-medium-pink/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-medium-pink/5 to-dark-pink/10 rounded-full blur-3xl animate-pulse-slow"></div>
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
            My <span className="bg-gradient-to-r from-accent-pink via-medium-pink to-dark-pink bg-clip-text text-transparent font-black" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: '#f8bbd9'}}>Skills</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            I combine technical expertise with creative design skills to create 
            <span className="font-bold text-gradient"> impactful digital experiences</span> that users love.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {skillsData.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>
        
        {/* Bottom decorative element */}
        <div className="flex justify-center mt-16">
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-medium-pink to-transparent rounded-full animate-pulse-slow"></div>
        </div>
      </div>
    </section>
  );
};

export default Skills;