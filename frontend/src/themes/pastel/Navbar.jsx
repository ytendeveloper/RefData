import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdAddBox, MdTableChart, MdViewList, MdStorage } from 'react-icons/md';
import { theme } from '../tokens/theme';

export default function Navbar() {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  const links = [
    { to: '/add', label: 'Add Structure', icon: MdAddBox },
    { to: '/structures', label: 'Structures', icon: MdTableChart },
    { to: '/elements', label: 'Elements', icon: MdViewList },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <span style={styles.brandDot} />
          Reference Data
        </Link>
        <div style={styles.links}>
          {links.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            const isHovered = hovered === to;
            return (
              <Link
                key={to}
                to={to}
                onMouseEnter={() => setHovered(to)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  ...styles.link,
                  ...(isActive ? styles.linkActive : {}),
                  ...(!isActive && isHovered ? styles.linkHover : {}),
                }}
              >
                <Icon style={{ ...styles.linkIcon, ...(isActive || isHovered ? { opacity: 1 } : {}) }} />{label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: theme.color.bgCard,
    borderBottom: `1.5px solid ${theme.color.border}`,
    boxShadow: theme.shadow.sm,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xl,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    maxWidth: 880,
    margin: '0 auto',
  },
  brand: {
    fontFamily: theme.font.display,
    fontSize: theme.font.sizeXl,
    fontWeight: theme.font.weightBold,
    color: theme.color.rose,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  brandDot: {
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: '#C4929E',
    boxShadow: '3px 0 0 0 #9AB8A0, 6px 0 0 0 #9BA4D4',
  },
  links: {
    display: 'flex',
    gap: '2px',
    backgroundColor: theme.color.bgInset,
    borderRadius: theme.radius.pill,
    padding: '3px',
  },
  link: {
    color: theme.color.textSecondary,
    textDecoration: 'none',
    fontFamily: theme.font.display,
    fontSize: theme.font.sizeSm,
    fontWeight: theme.font.weightMedium,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.pill,
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
  },
  linkIcon: {
    marginRight: '0.35rem',
    fontSize: '1.1em',
    opacity: 0.7,
  },
  linkHover: {
    color: theme.color.textPrimary,
    backgroundColor: 'rgba(196, 146, 158, 0.08)',
  },
  linkActive: {
    color: theme.color.textPrimary,
    backgroundColor: theme.color.bgCard,
    boxShadow: theme.shadow.sm,
    fontWeight: theme.font.weightSemibold,
  },
};
