import { useState, useEffect } from 'react';
import { MdSearch, MdTableChart } from 'react-icons/md';
import { listStructures } from '../api/client';
import { theme } from '../tokens/theme';

export default function SearchStructures() {
  const [query, setQuery] = useState('');
  const [structures, setStructures] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load(q = '') {
    try {
      const data = await listStructures(q);
      setStructures(data);
    } catch {
      setStructures([]);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    load(query);
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.headerBar} />
        <h1 style={styles.heading}>Structures</h1>
        <form onSubmit={handleSearch} style={styles.searchRow}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or description..."
            style={styles.input}
          />
          <button type="submit" style={styles.btn}>
            <MdSearch style={styles.btnIcon} />Search
          </button>
        </form>

        {structures.length === 0 ? (
          <div style={styles.emptyState}>
            <MdTableChart style={styles.emptyIcon} />
            <p style={styles.emptyText}>No structures found.</p>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Fields</th>
                </tr>
              </thead>
              <tbody>
                {structures.map((s, i) => (
                  <tr
                    key={s.id}
                    onMouseEnter={() => setHoveredRow(s.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      ...styles.tr,
                      backgroundColor: hoveredRow === s.id
                        ? '#F5E1E6'
                        : i % 2 === 0 ? 'transparent' : theme.color.bgInset,
                      cursor: 'pointer',
                    }}
                  >
                    <td style={styles.td}>
                      <span style={styles.nameBadge}>{s.name}</span>
                    </td>
                    <td style={styles.td}>{s.description}</td>
                    <td style={styles.td}>
                      <span style={styles.fieldPills}>
                        {s.fields.map((f) => (
                          <span key={f.name} style={styles.pill}>{f.name}</span>
                        ))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 880,
    margin: `${theme.spacing['2xl']} auto`,
    padding: `0 ${theme.spacing.lg}`,
  },
  card: {
    backgroundColor: theme.color.bgCard,
    borderRadius: theme.radius.xl,
    padding: `0 ${theme.spacing['2xl']} ${theme.spacing['2xl']}`,
    boxShadow: theme.shadow.lg,
    border: `1.5px solid ${theme.color.border}`,
    overflow: 'hidden',
  },
  headerBar: {
    height: 4,
    background: 'linear-gradient(90deg, #9BA4D4 0%, #A1C4D6 50%, #9AB8A0 100%)',
    margin: `0 -${theme.spacing['2xl']}`,
    marginBottom: theme.spacing.xl,
  },
  heading: {
    color: theme.color.textPrimary,
    marginTop: 0,
    marginBottom: theme.spacing.lg,
  },
  searchRow: {
    display: 'flex',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  input: {
    flex: 1,
  },
  btn: {
    backgroundColor: theme.color.peri,
    color: theme.color.textOnDark,
    border: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
    fontWeight: theme.font.weightBold,
    borderRadius: theme.radius.pill,
    boxShadow: '0 2px 10px rgba(155, 164, 212, 0.2)',
  },
  tableWrap: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    border: `1.5px solid ${theme.color.border}`,
  },
  th: {
    textAlign: 'left',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.color.periLighter,
    color: theme.color.periDark,
    fontFamily: theme.font.display,
    fontWeight: theme.font.weightBold,
    fontSize: theme.font.sizeXs,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderBottom: `1.5px solid ${theme.color.border}`,
  },
  td: {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: theme.font.sizeSm,
    color: theme.color.textPrimary,
    borderBottom: `1px solid ${theme.color.border}`,
  },
  tr: {
    transition: 'background-color 0.15s ease',
  },
  nameBadge: {
    fontFamily: theme.font.display,
    fontWeight: theme.font.weightSemibold,
    color: theme.color.periDark,
  },
  fieldPills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
  },
  pill: {
    display: 'inline-block',
    padding: '0.1rem 0.5rem',
    backgroundColor: theme.color.sageLighter,
    color: theme.color.sageDark,
    borderRadius: theme.radius.pill,
    fontSize: theme.font.sizeXs,
    fontWeight: theme.font.weightMedium,
    fontFamily: theme.font.body,
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing['3xl'],
  },
  emptyIcon: {
    fontSize: '2.5rem',
    color: theme.color.borderStrong,
  },
  emptyText: {
    color: theme.color.textMuted,
    fontFamily: theme.font.display,
    fontWeight: theme.font.weightMedium,
  },
  btnIcon: {
    marginRight: '0.3rem',
    fontSize: '1.15em',
  },
};
