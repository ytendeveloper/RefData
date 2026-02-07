import { useState } from 'react';
import { MdAdd, MdClose, MdCheck } from 'react-icons/md';
import { createStructure, addElements } from '../api/client';
import { theme } from '../tokens/theme';

export default function AddStructure() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([{ name: '', type: 'string', required: false }]);
  const [elements, setElements] = useState([]);
  const [message, setMessage] = useState('');
  const [createdStructure, setCreatedStructure] = useState(null);

  function addField() {
    setFields([...fields, { name: '', type: 'string', required: false }]);
  }

  function removeField(index) {
    setFields(fields.filter((_, i) => i !== index));
  }

  function updateField(index, key, value) {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    setFields(updated);
  }

  function addElementRow() {
    const row = {};
    fields.forEach((f) => { row[f.name] = ''; });
    setElements([...elements, row]);
  }

  function updateElement(index, fieldName, value) {
    const updated = [...elements];
    updated[index] = { ...updated[index], [fieldName]: value };
    setElements(updated);
  }

  function removeElement(index) {
    setElements(elements.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    const validFields = fields.filter((f) => f.name.trim());
    if (!name.trim() || validFields.length === 0) {
      setMessage('Name and at least one field are required.');
      return;
    }

    try {
      const structure = await createStructure({
        name: name.trim(),
        description: description.trim(),
        fields: validFields,
      });
      setCreatedStructure(structure);

      const validElements = elements.filter((el) =>
        Object.values(el).some((v) => v.trim())
      );
      if (validElements.length > 0) {
        await addElements(
          structure.id,
          validElements.map((values) => ({ values }))
        );
      }

      setMessage(`Structure "${structure.name}" created successfully!`);
      setName('');
      setDescription('');
      setFields([{ name: '', type: 'string', required: false }]);
      setElements([]);
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Error creating structure.');
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.headerBar} />
        <h1 style={styles.heading}>Add Structure</h1>
        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Country Codes"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. ISO country codes"
              style={styles.input}
            />
          </div>

          <h3 style={styles.sectionHeading}>
            <span style={{ ...styles.sectionDot, backgroundColor: '#9AB8A0' }} />
            Fields
          </h3>
          {fields.map((field, i) => (
            <div key={i} style={styles.fieldRow}>
              <input
                value={field.name}
                onChange={(e) => updateField(i, 'name', e.target.value)}
                placeholder="Field name"
                style={styles.inputSmall}
              />
              <select
                value={field.type}
                onChange={(e) => updateField(i, 'type', e.target.value)}
                style={styles.select}
              >
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
              </select>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField(i, 'required', e.target.checked)}
                />
                Required
              </label>
              <button type="button" onClick={() => removeField(i)} style={styles.removeBtn}>
                <MdClose />
              </button>
            </div>
          ))}
          <button type="button" onClick={addField} style={styles.addBtn}>
            <MdAdd style={styles.btnIcon} />Add Field
          </button>

          <h3 style={styles.sectionHeading}>
            <span style={{ ...styles.sectionDot, backgroundColor: '#9BA4D4' }} />
            Initial Elements <span style={styles.optional}>(optional)</span>
          </h3>
          {elements.map((el, i) => (
            <div key={i} style={styles.fieldRow}>
              {fields.filter((f) => f.name.trim()).map((f) => (
                <input
                  key={f.name}
                  value={el[f.name] || ''}
                  onChange={(e) => updateElement(i, f.name, e.target.value)}
                  placeholder={f.name}
                  style={styles.inputSmall}
                />
              ))}
              <button type="button" onClick={() => removeElement(i)} style={styles.removeBtn}>
                <MdClose />
              </button>
            </div>
          ))}
          <button type="button" onClick={addElementRow} style={styles.addBtn}>
            <MdAdd style={styles.btnIcon} />Add Element
          </button>

          <div style={{ marginTop: theme.spacing['2xl'] }}>
            <button type="submit" style={styles.submitBtn}>
              <MdCheck style={{ ...styles.btnIcon, fontSize: '1.15em' }} />Create Structure
            </button>
          </div>
        </form>
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
    background: 'linear-gradient(90deg, #C4929E 0%, #9AB8A0 50%, #9BA4D4 100%)',
    margin: `0 -${theme.spacing['2xl']}`,
    marginBottom: theme.spacing.xl,
  },
  heading: {
    color: theme.color.textPrimary,
    marginTop: 0,
    marginBottom: theme.spacing.xl,
  },
  sectionHeading: {
    color: theme.color.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  sectionDot: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  optional: {
    fontWeight: theme.font.weightRegular,
    fontSize: theme.font.sizeXs,
    color: theme.color.textMuted,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    display: 'block',
    width: '100%',
    marginTop: theme.spacing.xxs,
  },
  inputSmall: {
    flex: 1,
  },
  select: {},
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xxs,
    fontWeight: theme.font.weightRegular,
    fontFamily: theme.font.body,
    fontSize: theme.font.sizeSm,
    color: theme.color.textPrimary,
    textTransform: 'none',
    letterSpacing: 'normal',
  },
  fieldRow: {
    display: 'flex',
    gap: theme.spacing.xs,
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: theme.color.bgInset,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.color.border}`,
  },
  addBtn: {
    background: 'none',
    border: `1.5px dashed ${theme.color.borderStrong}`,
    padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
    color: theme.color.textMuted,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  removeBtn: {
    backgroundColor: theme.color.roseLighter,
    color: theme.color.roseDark,
    border: 'none',
    padding: '0.35rem',
    borderRadius: theme.radius.sm,
    minWidth: 28,
    minHeight: 28,
    fontSize: '1rem',
  },
  submitBtn: {
    backgroundColor: theme.color.rose,
    color: theme.color.textOnDark,
    border: 'none',
    padding: `${theme.spacing.sm} ${theme.spacing['2xl']}`,
    fontSize: theme.font.sizeMd,
    fontWeight: theme.font.weightBold,
    borderRadius: theme.radius.pill,
    boxShadow: '0 2px 12px rgba(196, 146, 158, 0.25)',
  },
  message: {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.color.sageLighter,
    borderLeft: `3px solid ${theme.color.sage}`,
    borderRadius: theme.radius.sm,
    color: theme.color.sageDark,
    fontWeight: theme.font.weightMedium,
    fontSize: theme.font.sizeSm,
  },
  btnIcon: {
    marginRight: '0.3rem',
    fontSize: '1.1em',
  },
};
