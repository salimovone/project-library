import { Link } from "react-router";
import logoDarkText from '../../assets/logo.png';
import logoWhiteText from '../../assets/logo-white-text.png';

const Logo = () => (
  <Link to="/" className="flex items-center hover:opacity-90 transition shrink-0 py-1">
    {/* Light mode: dark text */}
    <img
      src={logoDarkText}
      alt="Alfraganus University Library"
      className="h-8 md:h-9 w-auto block dark:hidden object-contain"
    />
    {/* Dark mode: white text */}
    <img
      src={logoWhiteText}
      alt="Alfraganus University Library"
      className="h-8 md:h-9 w-auto hidden dark:block object-contain"
    />
  </Link>
);

export default Logo;
