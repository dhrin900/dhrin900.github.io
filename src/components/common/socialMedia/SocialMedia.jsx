import {
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const socialIcons = [
  { icon: faEnvelope, link: "mailto:babegirl33010@gmail.com", label: "Email" },
  { icon: faFacebook, link: "https://facebook.com/dh.rin.637943", label: "Facebook" },
  { icon: faLinkedin, link: "#!", label: "LinkedIn" },
  { icon: faGithub, link: "#!", label: "GitHub" },
];

const SocialMedia = () => {
  return (
    <div className="flex gap-2">
      {socialIcons.map((item, index) => (
        <a
          href={item.link}
          target={item.link.startsWith('http') ? '_blank' : '_self'}
          rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}
          className="group p-3 bg-white border-2 border-medium-pink/30 hover:bg-medium-pink hover:border-medium-pink rounded-2xl transition-all duration-300 hover:scale-110"
          key={index}
          title={item.label}
        >
          <FontAwesomeIcon
            icon={item.icon}
            className="text-lg text-medium-pink group-hover:text-white transition-colors duration-300"
          />
        </a>
      ))}
    </div>
  );
};

export default SocialMedia;
