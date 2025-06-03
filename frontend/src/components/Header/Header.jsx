import {useEffect, useRef, useContext} from "react";
import logo from "../../assets/images/trainerhub-logo.png"; 
import { NavLink, Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi"
import { authContext } from "../../context/AuthContext";

const navLinks = [
  {
    path: '/home',
    display: 'Home'
  },
  {
    path: '/trainers',
    display: 'Find a Trainer'
  },
  {
    path: '/services',
    display: 'Services'
  },
  {
    path: '/contact',
    display: 'Contact'
  },
]

const Header = () => {

  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const { user, role, token } = useContext(authContext);

  const handleStickyHeader = () => {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky_header');
      } else {
        headerRef.current.classList.remove('sticky_header');
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();

    return () => window.removeEventListener('scroll', handleStickyHeader);
  });

  const toggleMenu = () => menuRef.current.classList.toggle('show_menu')

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/* ===== logo ===== */}
          <div>
            <Link to="/">
              <img src={logo} alt="TrainerHub" className="w-56 h-auto" />
            </Link>
          </div>

          {/* ===== menu ===== */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={navClass => 
                      navClass.isActive 
                      ? "text-primaryColor text-[16px] leading-7 font-[600]"
                      : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ------ nav right ------ */}
          <div className="flex items-center gap-4">
            {token && user ? (
              <>
                <div>
                  <Link to={`${role === 'trainer' ? '/trainers/profile/me' : '/users/profile/me'}`}>
                    <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                      <img 
                        src={user?.photo} 
                        className="w-full rounded-full" 
                        alt="" 
                      />
                    </figure>
                  </Link>
                </div>

                <Link to={`${role === 'trainer' ? '/trainers/profile/me' : '/users/profile/me'}`}>
                  <button className="bg-blue-200 hover:bg-blue-300 py-2 px-6 text-primaryColor font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                    My Profile
                  </button>
                </Link>
      
                <button
                  onClick={() => {
                    // You may want to move this to a handler function
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                  className="bg-red-500 py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to='/login'>
                  <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                    Login
                  </button>
                </Link>
                <Link to='/register'>
                  <button className="bg-orange-400 py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
          
        </div>
      </div>   
    </header>
  );
};

export default Header;
