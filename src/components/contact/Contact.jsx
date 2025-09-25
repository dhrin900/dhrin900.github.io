import {
  faEnvelope,
  faLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import Address from "./Address";
import Form from "./Form";
import SocialMedia from "../common/socialMedia/SocialMedia";

const addressData = [
  {
    icon: faLocationDot,
    title: "Location",
    description: "Bangkok, Thailand",
  },
  {
    icon: faEnvelope,
    title: "Email",
    description: "babegirl33010@gmail.com",
  },
  {
    icon: faFacebook,
    title: "Facebook",
    description: "facebook.com/dh.rin.637943",
  },
];

const Contact = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-accent-pink/5 to-medium-pink/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-medium-pink/5 to-dark-pink/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      
      <div className="content px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-1 bg-gradient-to-r from-accent-pink to-medium-pink rounded-full animate-shimmer"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-accent-pink to-medium-pink rounded-full animate-bounce-slow flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-medium-pink to-accent-pink rounded-full animate-shimmer"></div>
          </div>
          
          <h2 className="section-title font-black text-gray-800 mb-6">
            Let's <span className="bg-gradient-to-r from-accent-pink via-medium-pink to-dark-pink bg-clip-text text-transparent font-black" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: '#f8bbd9'}}>Connect</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            I'm available for <span className="font-bold text-gradient">freelance work and collaboration</span>. Drop me a line if you have a
            project you think I'd be a good fit for, or just want to say hello!
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Side - Contact Info */}
            <div className="space-y-8 animate-slide-left">
              {/* Contact Cards */}
              <div className="space-y-6">
                {addressData.map((item, index) => (
                  <Address item={item} key={index} index={index} />
                ))}
              </div>
              
              {/* Social Media Section */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Follow <span className="text-gradient">Me</span>
                </h3>
                <div className="flex justify-center">
                  <SocialMedia />
                </div>
              </div>
              
              {/* Availability Badge */}
              <div className="bg-gradient-to-br from-accent-pink to-medium-pink rounded-3xl p-6 text-center shadow-xl animate-glow">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-bold text-lg">Available for Projects</span>
                </div>
                <p className="text-white/90 text-sm">
                  Ready to bring your ideas to life!
                </p>
              </div>
            </div>
            
            {/* Right Side - Contact Form */}
            <div className="animate-slide-right">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-black text-gray-800 mb-4">
                    Send me a <span className="bg-gradient-to-r from-accent-pink via-medium-pink to-dark-pink bg-clip-text text-transparent font-black" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: '#f8bbd9'}}>Message</span>
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    I'm always open to discussing <span className="font-semibold text-gradient">new opportunities</span>, creative projects, 
                    or just having a friendly chat about technology and design.
                  </p>
                </div>
                
                <Form />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom decorative element */}
        <div className="flex justify-center mt-16">
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-medium-pink to-transparent rounded-full animate-pulse-slow"></div>
        </div>
      </div>
    </section>
  );
};

export default Contact;