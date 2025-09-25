import person from "../../assets/profile.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faMapMarkerAlt, faUniversity } from "@fortawesome/free-solid-svg-icons";
import SocialMedia from "../common/socialMedia/SocialMedia";

const Profile = () => {
  return (
    <div
      className="relative mx-4 xxl:mx-0.5 -bottom-20 lg:-bottom-28 z-10 rounded-3xl bg-white drop-shadow-2xl max-xl:mb-5 shadow-card-shadow xl:p-16 lg:p-12 md:p-10 sm:p-8 p-6"
      id="about"
    >
      <div className="flex max-md:flex-col justify-between items-center gap-8">
        {/* Profile image */}
        <div className="xxl:max-w-96 w-auto h-auto">
          <div className="max-w-96 h-96 object-fill overflow-hidden rounded-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-medium-pink/20 to-dark-pink/20 rounded-2xl"></div>
            <img
              className="bg-light-pink h-full w-full object-cover border-4 border-medium-pink/30 rounded-2xl"
              src={person}
              alt="DH Rin Profile"
            />
          </div>
          {/* Social media section */}
          <div className="relative -bottom-6">
            <div className="flex justify-center">
              <div className="px-8 py-4 z-50 text-center bg-white rounded-2xl shadow-xl border border-medium-pink/20">
                <SocialMedia />
              </div>
            </div>
          </div>
        </div>

        <div className="max-sm:w-full w-full max-w-2xl">
          <h2 className="text-3xl xxs:text-4xl sm:text-5xl lg:text-6xl max-md:text-center font-bold mb-6 text-gray-800">
            About <span className="text-gradient">Me</span>
          </h2>
          
          <div className="text-base xs:text-lg lg:text-xl font-normal max-md:text-center text-gray-600 space-y-4">
            <p>
              I'm a passionate Java Developer, UI/UX Design Enthusiast, and Figma Designer 
              studying at Asia-Pacific International University. I combine technical expertise 
              with creative design thinking to build exceptional digital experiences.
            </p>
            <p>
              My journey in technology started with Java development, but my curiosity led me 
              to explore the world of UI/UX design. I believe that great software isn't just 
              about functionality—it's about creating meaningful connections between users and technology.
            </p>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center max-md:justify-center gap-3">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-medium-pink text-lg" />
              <span className="text-gray-700 font-medium">Bangkok, Thailand</span>
            </div>
            <div className="flex items-center max-md:justify-center gap-3">
              <FontAwesomeIcon icon={faUniversity} className="text-medium-pink text-lg" />
              <span className="text-gray-700 font-medium">Asia-Pacific International University</span>
            </div>
          </div>
          
          <div className="mt-8 flex max-md:justify-center gap-4">
            <a
              className="btn btn-lg px-8 py-3 btn-primary"
              href="#portfolio"
            >
              View My Projects
            </a>
            <a
              className="btn btn-lg px-8 py-3 btn-secondary"
              href="#!"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" /> Download CV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
