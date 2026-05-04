import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

function Topbar() {
  return (
    <div className="bg-[#ea2e0e] text-white">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">

        {/* Left: Social Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5" />
          </a>

          <a href="#" className="hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5" />
          </a>

          <a href="#" className="hover:text-gray-300">
            <RiTwitterXLine className="h-5 w-5" />
          </a>
        </div>

        {/* Middle: Announcement */}
        <div className="flex-1 text-center text-sm px-4">
          <span>
            We ship globally - fast and reliable shipping with tracking. Shop now and enjoy global delivery to your doorstep!
          </span>
        </div>

        {/* Right: Contact */}
        <div className="hidden md:block text-sm whitespace-nowrap">
          <a href="tel:+94762923742" className="hover:text-gray-300">
            Call Us: +94 76 292 3742
          </a>
        </div>

      </div>
    </div>
  );
}

export default Topbar;