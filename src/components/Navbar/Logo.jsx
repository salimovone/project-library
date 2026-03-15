import { Link } from "react-router";
import logo from '../../assets/logo.png';

const Logo = () => (
  <Link to={"/"} className="flex items-center hover:opacity-80 transition">
    <img width={120} src={logo} alt="Kutubxona" className="md:w-37.5 " />
  </Link>
);

export default Logo;
