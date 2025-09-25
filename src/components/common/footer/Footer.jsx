

/* Footer nabLinks */
const navItems = [
  { id: 1, name: "Home", url: "introduction" },
  { id: 2, name: "About", url: "about" },
  { id: 3, name: "Skills", url: "skills" },
  { id: 4, name: "Portfolio", url: "portfolio" },
  { id: 5, name: "Contact", url: "contact" },
];
const copyrightYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-medium-pink to-dark-pink py-16">
      <div className="content px-4">
        <div className="flex max-md:flex-col justify-between items-center gap-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold">DH Rin</h3>
            <p className="text-sm sm:text-base text-white/80">Java Developer & UI/UX Designer</p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.id}
                className="group relative text-sm sm:text-base font-medium hover:text-white/80 transition-colors duration-300"
                href={`#${item.url.toLowerCase()}`}
              >
                {item.name}
                <span className="absolute left-0 bottom-0 h-0.5 w-full bg-white scale-x-0 duration-300 group-hover:scale-x-100"></span>
              </a>
            ))}
          </nav>
          
          <div className="text-center">
            <p className="text-sm sm:text-base text-white/80">
              Let's create something amazing together!
            </p>
            <a 
              href="mailto:babegirl33010@gmail.com"
              className="inline-block mt-2 text-sm font-semibold hover:text-white/80 transition-colors duration-300"
            >
              babegirl33010@gmail.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-sm sm:text-base text-white/80">
            Copyright &copy; {copyrightYear} DH Rin. Made with ❤️ in Bangkok, Thailand.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
