import { useState, useEffect } from 'react';
import { MdSearch } from 'react-icons/md';
import { listStructures } from '../api/client';
import { theme } from '../tokens/theme';

export default function SearchStructures() {
  const [query, setQuery] = useState('');
  const [structures, setStructures] = useState([]);

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
      <h1>Structures</h1>
      <form onSubmit={handleSearch} style={styles.searchRow}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or description..."
          style={styles.input}
        />
        <button type="submit" style={styles.btn}><MdSearch style={styles.btnIcon} />Search</button>
      </form>

      {structures.length === 0 ? (
        <p style={styles.empty}>No structures found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Fields</th>
            </tr>
          </thead>
          <tbody>
            {structures.map((s) => (
              <tr key={s.id} style={styles.tr}>
                <td style={styles.td}>{s.name}</td>
                <td style={styles.td}>{s.description}</td>
                <td style={styles.td}>
                  {s.fields.map((f) => f.name).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: `${theme.spacing.xl} auto`,
    padding: `0 ${theme.spacing.md}`,
  },
  searchRow: {
    display: 'flex',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  input: {
    flex: 1,
  },
  btn: {
    backgroundColor: theme.color.interactiveDefault,
    color: theme.color.white,
    border: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    fontWeight: theme.font.weightSemibold,
  },
  th: {
    textAlign: 'left',
    padding: theme.spacing.sm,
    backgroundColor: theme.color.brandBayBlue,
    color: theme.color.white,
    fontWeight: theme.font.weightSemibold,
    fontSize: theme.font.sizeXs,
  },
  td: {
    padding: theme.spacing.sm,
    borderBottom: `1px solid ${theme.color.interactiveDisabled}`,
    fontSize: theme.font.sizeSm,
  },
  tr: {
    transition: 'background-color 0.1s ease',
  },
  empty: {
    color: theme.color.brandGraniteGray,
    fontStyle: 'italic',
  },
  btnIcon: {
    verticalAlign: 'middle',
    marginRight: '0.3rem',
    fontSize: '1.1em',
  },
};
