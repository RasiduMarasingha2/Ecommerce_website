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

         <SearchBar/>

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
             <nav className="space-y-4">

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
      </div>
      </div>
    </>
  );
};

export default Navbar;