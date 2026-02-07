import { useState, useEffect } from 'react';
import { MdSearch, MdViewList, MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { listStructures, getStructure, searchElements } from '../api/client';
import { theme } from '../tokens/theme';

export default function SearchElements() {
  const [structures, setStructures] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [query, setQuery] = useState('');
  const [elements, setElements] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [hoveredRow, setHoveredRow] = useState(null);
  const pageSize = 50;

  useEffect(() => {
    listStructures().then(setStructures).catch(() => {});
  }, []);

  async function loadElements(id, q = '', pg = 0) {
    try {
      const data = await searchElements(id, q, pg * pageSize, pageSize);
      setElements(data.items);
      setTotal(data.total);
    } catch {
      setElements([]);
      setTotal(0);
    }
  }

  async function handleSelectStructure(id) {
    setSelectedId(id);
    setQuery('');
    setElements([]);
    setTotal(0);
    setPage(0);
    if (!id) {
      setSelectedStructure(null);
      return;
    }
    try {
      const s = await getStructure(id);
      setSelectedStructure(s);
      await loadElements(id);
    } catch {
      setSelectedStructure(null);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!selectedId) return;
    setPage(0);
    await loadElements(selectedId, query, 0);
  }

  async function handlePageChange(newPage) {
    setPage(newPage);
    await loadElements(selectedId, query, newPage);
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
              <div style={styles.inputWrap}>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search element values..."
                  style={styles.input}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => { setQuery(''); setPage(0); loadElements(selectedId); }}
                    style={styles.clearBtn}
                    aria-label="Clear search"
                  >
                    <MdClose />
                  </button>
                )}
              </div>
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
              <>
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
                              ? theme.color.goldLighter
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
                <div style={styles.paginationBar}>
                  <span style={styles.rowCount}>
                    {total.toLocaleString()} row{total !== 1 ? 's' : ''}
                    {total > pageSize && ` \u2014 showing ${(page * pageSize + 1).toLocaleString()}\u2013${Math.min((page + 1) * pageSize, total).toLocaleString()}`}
                  </span>
                  {total > pageSize && (
                    <div style={styles.pageControls}>
                      <button
                        type="button"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                        style={{
                          ...styles.pageBtn,
                          ...(page === 0 ? styles.pageBtnDisabled : {}),
                        }}
                      >
                        <MdChevronLeft style={{ fontSize: '1.2rem' }} /> Prev
                      </button>
                      <span style={styles.pageInfo}>
                        Page {page + 1} of {Math.ceil(total / pageSize)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={(page + 1) * pageSize >= total}
                        style={{
                          ...styles.pageBtn,
                          ...((page + 1) * pageSize >= total ? styles.pageBtnDisabled : {}),
                        }}
                      >
                        Next <MdChevronRight style={{ fontSize: '1.2rem' }} />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1400,
    margin: `${theme.spacing['2xl']} auto`,
    padding: `0 ${theme.spacing.lg}`,
  },
  card: {
    backgroundColor: theme.color.bgCard,
    borderRadius: theme.radius.lg,
    padding: `0 ${theme.spacing['2xl']} ${theme.spacing['2xl']}`,
    boxShadow: theme.shadow.md,
    border: `1px solid ${theme.color.border}`,
    overflow: 'hidden',
  },
  headerBar: {
    height: 3,
    background: `linear-gradient(90deg, ${theme.color.goldLight} 0%, ${theme.color.gold} 50%, ${theme.color.goldDark} 100%)`,
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
  inputWrap: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingRight: '2.2rem',
  },
  clearBtn: {
    position: 'absolute',
    right: '0.4rem',
    background: 'none',
    border: 'none',
    padding: '0.25rem',
    color: theme.color.textMuted,
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: theme.radius.sm,
    boxShadow: 'none',
    lineHeight: 1,
  },
  btn: {
    backgroundColor: theme.color.charcoal,
    color: theme.color.ivory,
    border: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
    fontWeight: theme.font.weightMedium,
    borderRadius: theme.radius.sm,
    letterSpacing: '0.04em',
  },
  tableWrap: {
    borderRadius: theme.radius.md,
    overflowX: 'auto',
    border: `1px solid ${theme.color.border}`,
  },
  th: {
    textAlign: 'left',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.color.charcoal,
    color: theme.color.goldLight,
    fontFamily: theme.font.body,
    fontWeight: theme.font.weightMedium,
    fontSize: theme.font.sizeXs,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    borderBottom: `1px solid ${theme.color.ink}`,
    whiteSpace: 'nowrap',
  },
  td: {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: theme.font.sizeSm,
    color: theme.color.textPrimary,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    whiteSpace: 'nowrap',
  },
  tr: {
    transition: 'background-color 0.2s ease',
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
    fontWeight: theme.font.weightRegular,
    fontStyle: 'italic',
  },
  btnIcon: {
    marginRight: '0.3rem',
    fontSize: '1.15em',
  },
  paginationBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    marginTop: theme.spacing.sm,
  },
  rowCount: {
    fontSize: theme.font.sizeSm,
    color: theme.color.textSecondary,
    fontWeight: theme.font.weightMedium,
  },
  pageControls: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  pageBtn: {
    backgroundColor: theme.color.charcoal,
    color: theme.color.ivory,
    border: 'none',
    padding: `${theme.spacing.xxs} ${theme.spacing.md}`,
    fontWeight: theme.font.weightMedium,
    borderRadius: theme.radius.sm,
    fontSize: theme.font.sizeXs,
    letterSpacing: '0.04em',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
  },
  pageBtnDisabled: {
    opacity: 0.4,
    cursor: 'default',
    pointerEvents: 'none',
  },
  pageInfo: {
    fontSize: theme.font.sizeSm,
    color: theme.color.textSecondary,
  },
};
