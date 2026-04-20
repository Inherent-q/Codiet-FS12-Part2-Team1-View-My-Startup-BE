import { Link, useLocation } from "react-router-dom";
import "./GNB.css";
import logo from "../assets/logo.svg";

const NAV_ITEMS = [
  {
    label: "나의 기업 비교",
    to: "/select",
    activePaths: ["/select", "/results"],
  },
  {
    label: "비교 현황",
    to: "/compare",
    activePaths: ["/compare"],
  },
  {
    label: "투자 현황",
    to: "/investment",
    activePaths: ["/investment"],
  },
];

export default function GNB() {
  const location = useLocation();

  return (
    <header className="gnb">
      <div className="gnb__inner">
        <Link to="/" className="gnb__logo">
          <img src={logo} alt="view my startup" className="gnb__logo-img" />
        </Link>

        <nav className="gnb__nav">
          {NAV_ITEMS.map(({ label, to, activePaths }) => {
            const isActive = activePaths.includes(location.pathname);

            return (
              <Link
                key={to}
                to={to}
                className={`gnb__nav-item${isActive ? " gnb__nav-item--active" : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
