import { Link } from "react-router-dom";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";



const Footer = () => {
  return (
  <footer className=" border- py-12">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 lg:px-0">

      <div>
        <h3 className="text-lg text-gray-800 mb-4">

        <b>  Newsletter </b>

        </h3>

        <p className=" text-gray-500 mb-4">
          Be the first to know about new arrivals, get special offers and other discount information.
        </p>

        <p className="font-medium text-sm text-gray-600 mb-6">
         <b> Sign up and get 10% off your first purchase.</b>
          
        </p>
        

        {/* Newsletter Form */}
        <form className="flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 w-full text-sm border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all" required/>
          <button type="submit" className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all">
            Subscribe
          </button>  
            </form>
      </div>
 
           {/* Shop Links*/}
           <div>
        <h3 className="text-lg text-gray-800 mb-4">
          <b> Shop </b>
        </h3>
        <ul className=" space-y-2 text-gray-600">
          <li>
            <link to="#" className=" hover:text-gray-500 transition-color" />
            Top selling Electronis
            
          </li>
       
           <li> 
            <link to="#" className=" hover:text-gray-500 transition-color" />
            selling time and accessories
          </li> 
          
           <li>
            <link to="#" className=" hover:text-gray-500 transition-color" />
            Top selling Home & Living
          </li> 

           <li>
            <link to="#" className=" hover:text-gray-500 transition-color" />
            Top selling Gaming
          </li>   

       </ul>
     </div>
       
       {/* Support Links*/}

        <div>
        <h3 className="text-lg text-gray-800 mb-4">
        <b> Shop </b>
        </h3>
        <ul className=" space-y-2 text-gray-600">
          <li>
            <link to="#" className=" hover:text-gray-500 transition-color" />
            Contact Us
          </li>
       
           <li> 
            <link to="#" className=" hover:text-gray-500 transition-color" />
            About Us
          </li> 
          
           <li>
            <link to="#" className=" hover:text-gray-500 transition-color" />
            FAQ
          </li> 

           <li>
            <link to="#" className=" hover:text-gray-500 transition-color" />
            Features
          </li>   

       </ul>
     </div>

      {/* Follow Us */}

       <div>
        <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
        <div className="flex items-center space-x-4 mb-6">    
           <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500">

              <TbBrandMeta className="w-6 h-6"/>
           </a>
           <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-500"
           >
             <IoLogoInstagram className="w-6 h-6"/>
           </a>

            <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-500"
           >
             <RiTwitterXLine className="w-5 h-5"/>
           </a>
           </div>
           <p className="text-gray-500">Call Us</p>

           <p>
            <FiPhoneCall className="inline-block mr-2"/>

            076-292-3742

           </p>
      </div>

             
    </div>

    {/*Footer Bottom */}

    <div  className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
      <p>
        <p className="text-gray-500 text-sm tracking-tighter text-center">
          @ 2025, CompileTab. All Rights Reserved.
        </p>
      </p>
    </div>


  </footer>
  );
}

export default Footer