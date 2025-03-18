import { Link } from "react-router-dom";

const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="nav-left">Todo App</div>
        <div className="nav-right">
          <a href="/profile" className="nav-link">Profile</a>
          <a href="/todo" className="nav-link">Todo List</a>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  