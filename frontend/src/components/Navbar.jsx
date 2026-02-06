import { Link, useLocation } from 'react-router-dom';
import { MdAddBox, MdTableChart, MdViewList, MdStorage } from 'react-icons/md';
import { theme } from '../tokens/theme';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/add', label: 'Add Structure', icon: MdAddBox },
    { to: '/structures', label: 'Structures', icon: MdTableChart },
    { to: '/elements', label: 'Elements', icon: MdViewList },
  ];

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}><MdStorage style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />RefData</Link>
      <div style={styles.links}>
        {links.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                ...styles.link,
                ...(isActive ? styles.linkActive : {}),
              }}
            >
              <Icon style={styles.linkIcon} />{label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xl,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    backgroundColor: theme.color.brandBayBlue,
    color: theme.color.white,
    boxShadow: theme.shadow.medium,
  },
  brand: {
    fontSize: theme.font.sizeLg,
    fontWeight: theme.font.weightSemibold,
    color: theme.color.white,
    textDecoration: 'none',
    letterSpacing: '0.02em',
  },
  links: {
    display: 'flex',
    gap: theme.spacing.md,
  },
  link: {
    color: 'rgba(255, 255, 255, 0.75)',
    textDecoration: 'none',
    fontSize: theme.font.sizeSm,
    padding: `${theme.spacing.xxs} ${theme.spacing.xs}`,
    borderBottom: '2px solid transparent',
    transition: 'color 0.15s ease, border-color 0.15s ease',
    display: 'flex',
    alignItems: 'center',
  },
  linkIcon: {
    marginRight: '0.35rem',
    fontSize: '1.1em',
  },
  linkActive: {
    color: theme.color.white,
    fontWeight: theme.font.weightSemibold,
    borderBottomColor: theme.color.white,
  },
};
