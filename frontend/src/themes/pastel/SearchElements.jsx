import { useState, useEffect } from 'react';
import { MdSearch, MdViewList } from 'react-icons/md';
import { listStructures, getStructure, searchElements } from '../api/client';
import { theme } from '../tokens/theme';

export default function SearchElements() {
  const [structures, setStructures] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [query, setQuery] = useState('');
  const [elements, setElements] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

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
      <div style={styles.card}>
        <div style={styles.headerBar} />
        <h1 style={styles.heading}>Search Elements</h1>

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
              <button type="submit" style={styles.btn}>
                <MdSearch style={styles.btnIcon} />Search
              </button>
            </form>

            {elements.length === 0 ? (
              <div style={styles.emptyState}>
                <MdViewList style={styles.emptyIcon} />
                <p style={styles.emptyText}>No elements found.</p>
              </div>
            ) : (
              <div style={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      {fieldNames.map((f) => (
                        <th key={f} style={styles.th}>{f}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {elements.map((el, i) => (
                      <tr
                        key={el.id}
                        onMouseEnter={() => setHoveredRow(el.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          ...styles.tr,
                          backgroundColor: hoveredRow === el.id
                            ? '#FFF0E8'
                            : i % 2 === 0 ? 'transparent' : theme.color.bgInset,
                          cursor: 'pointer',
                        }}
                      >
                        {fieldNames.map((f) => (
                          <td key={f} style={styles.td}>{String(el.values[f] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
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
    background: 'linear-gradient(90deg, #E8B89D 0%, #C4929E 50%, #A1C4D6 100%)',
    margin: `0 -${theme.spacing['2xl']}`,
    marginBottom: theme.spacing.xl,
  },
  heading: {
    color: theme.color.textPrimary,
    marginTop: 0,
    marginBottom: theme.spacing.lg,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  select: {
    display: 'block',
    width: '100%',
    marginTop: theme.spacing.xxs,
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
    backgroundColor: theme.color.sage,
    color: theme.color.textOnDark,
    border: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
    fontWeight: theme.font.weightBold,
    borderRadius: theme.radius.pill,
    boxShadow: '0 2px 10px rgba(154, 184, 160, 0.2)',
  },
  tableWrap: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    border: `1.5px solid ${theme.color.border}`,
  },
  th: {
    textAlign: 'left',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.color.peachLighter,
    color: theme.color.roseDark,
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
