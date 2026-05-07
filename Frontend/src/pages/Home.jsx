import Hero from "../components/Layout/Hero.jsx";
import NewArrivals from "../components/Products/NewArrivals.jsx";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";

const placeholderProducts = [

] 



const Home = () => {
  return (
    <div>  
      <Hero/>
      <NewArrivals/>
      {/* Best Sell*/}
      <h2 className="text-3xl text-center font-bold mb-4">
        Best Sell
      </h2>
      <ProductDetails/> 

      <div className="container mx-auto">

        <h2 className="text-3xl text-center font-bold mb-4">
                  
                All Products
        </h2>
          
          < ProductGrid products={placeholderProducts} />


      </div>
    </div>
  )
}

export default Home