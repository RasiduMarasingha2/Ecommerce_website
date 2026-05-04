import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

const products = [
  "iPhone 15",
  "Samsung Galaxy",
  "Gaming Laptop",
  "Headphones",
  "Phone Case",
  "Smart Watch",
  "Tablet",
  "Gaming Mouse",
];

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filter products
  const filtered = products.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Search action
  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">

      {/* 🔍 ICON (closed state) */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}>
          <HiMagnifyingGlass className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {/* 🔥 SEARCH BAR (open state) */}
      {isOpen && (
        <div className="w-full">

          {/* INPUT BOX */}
          <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow">

            <HiMagnifyingGlass className="text-gray-500" />

            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            {/* ❌ CLOSE */}
            <button
              onClick={() => {
                setIsOpen(false);
                setSearchTerm("");
              }}
              className="text-gray-500 ml-2"
            >
              ✖
            </button>
          </div>

          {/* 📦 DROPDOWN */}
          {searchTerm && (
            <div className="absolute w-full bg-white shadow-md mt-1 rounded-md z-50">

              {filtered.length > 0 ? (
                filtered.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchTerm(item);
                      handleSearch();
                    }}
                  >
                    {item}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  No results found
                </div>
              )}

              {/* 🔵 MOBILE SEARCH BUTTON */}
              <button
                onClick={handleSearch}
                className="w-full bg-black text-white py-2 rounded-b-md"
              >
                Search
              </button>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default SearchBar;