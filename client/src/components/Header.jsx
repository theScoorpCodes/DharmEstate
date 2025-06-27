import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
function Header() {
  const user  = useSelector((state) => state.user);
  console.log(user);
  
  return (
    <header className="bg-slate-200 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Dharm</span>
            <span className="text-slate-800">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-500 " />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline ">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-sl-sate-700 hover:underline ">
              About
            </li>
          </Link>
          {user.currentUser != null ? (
            <Link to="/profile">
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={user.currentUser.avatar}
                alt="avatar"
              />
            </Link>
          ) : (
            <Link to="/signin">
              <li className="text-slate-700 hover:underline ">Sign In</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
