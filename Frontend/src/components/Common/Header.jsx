
import Topbar from '../Layout/Topbar'
import Navbar from '../Common/Navbar'

export const Header = () => {
  return (
    <div>
        <header className="border-b border-gray-300">
        {/*Topbar*/}
        <Topbar/>
        {/*Navbar*/}
        <Navbar/>
        {/*Cart Drawer*/}
        </header>
     </div>
  );
}
