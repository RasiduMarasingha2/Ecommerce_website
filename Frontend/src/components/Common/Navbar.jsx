import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
import SearchBar from "./SearchBar";
import { HiBars3BottomRight } from "react-icons/hi2";

function Navbar() {
  return (
    <nav className="container mx-auto flex justify-between items-center py-4 px-6">

      {/* Left - Logo */}
      <div>
        <Link to="/" className="text-2xl font-medium">Rabbit</Link>
      </div>

      {/* Center - Navigation Links */}
      <div className="hidden md:flex space-x-6">
        <Link to="/" className="hover:text-black text-sm text-gray-700 font-medium uppercase">
          Electronics
        </Link>

        <Link to="/" className="hover:text-black text-sm text-gray-700 font-medium uppercase">
          Home & Living
        </Link>

        <Link to="/" className="hover:text-black text-sm text-gray-700 font-medium uppercase">
          Gaming
        </Link>

        <Link to="/" className="hover:text-black text-sm text-gray-700 font-medium uppercase">
          Automotive
        </Link>

        <Link to="/" className="hover:text-black text-sm text-gray-700 font-medium uppercase">
          Toys & Baby Products
        </Link>
      </div>

      {/* Right - Icons */}
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="hover:text-black">
          <HiOutlineUser className="h-6 w-6 text-gray-700" />
        </Link>
 
        <button className="relative hover:text-black">
          <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
        </button>

         <SearchBar/>

          <button className="md:hidden">
          <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
        </button>



      </div>

    </nav>
  );
}

export default Navbar;