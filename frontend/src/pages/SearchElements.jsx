import { useState, useEffect } from 'react';
import { MdSearch } from 'react-icons/md';
import { listStructures, getStructure, searchElements } from '../api/client';
import { theme } from '../tokens/theme';

export default function SearchElements() {
  const [structures, setStructures] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [query, setQuery] = useState('');
  const [elements, setElements] = useState([]);

  useEffect(() => {
    listStructures().then(setStructures).catch(() => {});
  }, []);

  async function handleSelectStructure(id) {
    setSelectedId(id);
    setQuery('');
    setElements([]);
    if (!id) {
      setSelectedStructure(null);
      return;
    }
    try {
      const s = await getStructure(id);
      setSelectedStructure(s);
      const els = await searchElements(id);
      setElements(els);
    } catch {
      setSelectedStructure(null);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!selectedId) return;
    try {
      const els = await searchElements(selectedId, query);
      setElements(els);
    } catch {
      setElements([]);
    }
  }

  const fieldNames = selectedStructure?.fields.map((f) => f.name) || [];

  return (
    <div style={styles.container}>
      <h1>Search Elements</h1>

      <div style={styles.formGroup}>
        <label>Select Structure</label>
        <select
          value={selectedId}
          onChange={(e) => handleSelectStructure(e.target.value)}
          style={styles.select}
        >
          <option value="">-- choose --</option>
          {structures.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {selectedStructure && (
        <>
          <form onSubmit={handleSearch} style={styles.searchRow}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search element values..."
              style={styles.input}
            />
            <button type="submit" style={styles.btn}><MdSearch style={styles.btnIcon} />Search</button>
          </form>

          {elements.length === 0 ? (
            <p style={styles.empty}>No elements found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  {fieldNames.map((f) => (
                    <th key={f} style={styles.th}>{f}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {elements.map((el) => (
                  <tr key={el.id} style={styles.tr}>
                    {fieldNames.map((f) => (
                      <td key={f} style={styles.td}>{String(el.values[f] ?? '')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
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
  formGroup: {
    marginBottom: theme.spacing.md,
  },
  select: {
    display: 'block',
    width: '100%',
    marginTop: theme.spacing.xxs,
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
