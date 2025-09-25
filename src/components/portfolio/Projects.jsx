import { faArrowRight, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Projects = ({ data }) => {
  return (
    <div className="group bg-white rounded-3xl shadow-lg border border-medium-pink/20 overflow-hidden card-hover">
      <div className="relative overflow-hidden">
        <img 
          src={data?.image} 
          alt={`${data?.title} preview`} 
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FontAwesomeIcon 
            icon={faExternalLinkAlt} 
            className="text-white text-lg drop-shadow-lg"
          />
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-medium-pink to-dark-pink text-white text-xs font-semibold rounded-full mb-3">
            {data?.category}
          </span>
          <h3 className="text-gray-900 text-xl font-bold group-hover:text-medium-pink transition-colors duration-300">
            {data?.title}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed">
          {data?.description}
        </p>
        
        {data?.tools && (
          <div className="flex flex-wrap gap-2">
            {data.tools.map((tool, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-light-pink text-medium-pink text-xs font-medium rounded-lg"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
        
        <a
          href={data?.link}
          className="inline-flex items-center gap-2 text-medium-pink font-semibold hover:text-dark-pink transition-colors duration-300 group/link"
        >
          View Project
          <FontAwesomeIcon 
            icon={faArrowRight} 
            className="text-sm group-hover/link:translate-x-1 transition-transform duration-300" 
          />
        </a>
      </div>
    </div>
  );
};

export default Projects;
