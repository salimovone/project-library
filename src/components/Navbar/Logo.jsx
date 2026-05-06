import { Link } from "react-router";
import logo from '../../assets/logo.png';

const Logo = () => (
  <Link to={"/"} className="flex items-center hover:opacity-80 transition not-dark:drop-shadow-[0_2px_2px_rgba(5,5,5,0.8)]">
    <img width={120} src={logo} alt="Kutubxona" className="md:w-37.5 " />
  </Link>
);

export default Logo;
