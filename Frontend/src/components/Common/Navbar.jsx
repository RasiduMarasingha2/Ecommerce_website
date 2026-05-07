import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
import SearchBar from "./SearchBar";
import { HiBars3BottomRight } from "react-icons/hi2";
import CartDrawer from "../Layout/CartDrawer";
import React from "react";
import { IoMdClose } from "react-icons/io";




const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const [navDrawerOpen, setNavDrawerOpen] = React.useState(false);
  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };



  return (
    <>
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
 
        <button onClick={toggleCartDrawer} className="relative hover:text-black">
          <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
        </button>

        <div className="flex items-center gap-2">
          <SearchBar/>

          {/* Login & Register Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Link 
              to="/login" 
              className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </div>
        </div>

        <button onClick={toggleNavDrawer} className="md:hidden">
          <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
        </button>

      </div>

    </nav>
    <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
   <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
      
      <div className="flex justify-end p-4">
        <button onClick={toggleNavDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
             <h2 className="text-xl font-semibold mb-4">Menu</h2>
             <nav className="space-y-4 mb-6">

              <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
                Electronics              
              </Link>
               <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
                Home & Living              
              </Link>
               <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
                Gaming              
              </Link>
               <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
                Automotive              
              </Link>
               <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
                Toys & Baby Products              
              </Link>
             </nav>

             {/* Mobile Login & Register Buttons */}
             <div className="border-t pt-4 space-y-3 sm:hidden">
               <Link 
                 to="/login" 
                 onClick={toggleNavDrawer}
                 className="block w-full px-4 py-2 text-center text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition"
               >
                 Login
               </Link>
               <Link 
                 to="/register" 
                 onClick={toggleNavDrawer}
                 className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
               >
                 Register
               </Link>
             </div>
      </div>
      </div>
    </>
  );
};

export default Navbar;