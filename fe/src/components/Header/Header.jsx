import { NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-view">view</span>
          <span className="logo-main">my startup</span>
        </div>
        <nav className="nav">
          <NavLink
            to="/select"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            나의 기업 비교
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            비교 현황
          </NavLink>
          <NavLink
            to="/investment"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            투자 현황
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
