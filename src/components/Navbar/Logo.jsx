import { Link } from "react-router";
import logo from '../../assets/logo.png';

const Logo = () => (
  <Link to="/" className="flex items-center bg-[var(--navy-primary)] rounded-xl px-3.5 py-2 shadow-xs hover:opacity-95 transition shrink-0">
    <img src={logo} alt="Alfraganus University Library" className="h-7 w-auto block brightness-0 invert opacity-95" />
  </Link>
);

export default Logo;
