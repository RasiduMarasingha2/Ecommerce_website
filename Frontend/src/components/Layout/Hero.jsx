import heroImage from "../../assets/h3.avif";
import { Link } from "react-router-dom";


function Hero() {
  return <section className="relative">
    <img src={heroImage} alt="Hero image" 
     className="w-full h-[300px] sm:h-[400px] md:h-[600px] lg:h-[750px] object-cover"/>
      <div className="absolute inset-0 bg-black/40 flex items-center justify-start px-4 sm:px-10">
  <div className="text-left text-white p-6 max-w-xs sm:max-w-md md:max-w-xl">

    <h1 className="text-3xl sm:text-5xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
      Shop Now
    </h1>

    <p className="text-xs sm:text-sm md:text-lg mb-6 leading-relaxed">
      Explore our exclusive collection of top selling electronics, home & living, and gaming products. Don't miss out on the best deals and latest trends in tech and lifestyle.
    </p>
    <Link
    to="#"
    className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg">

        <b>Shop Now</b>
    
    </Link>

  </div>
</div>
  </section>
    
  
}

export default Hero