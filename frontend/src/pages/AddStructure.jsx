import { useState } from 'react';
import { MdAdd, MdDelete, MdCheckCircle } from 'react-icons/md';
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
      <h1>Add Structure</h1>
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

        <h3>Fields</h3>
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
              <MdDelete style={styles.btnIcon} />Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addField} style={styles.addBtn}>
          <MdAdd style={styles.btnIcon} />Add Field
        </button>

        <h3>Initial Elements (optional)</h3>
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
              <MdDelete style={styles.btnIcon} />Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addElementRow} style={styles.addBtn}>
          <MdAdd style={styles.btnIcon} />Add Element
        </button>

        <div style={{ marginTop: theme.spacing.lg }}>
          <button type="submit" style={styles.submitBtn}><MdCheckCircle style={styles.btnIcon} />Create Structure</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: `${theme.spacing.xl} auto`,
    padding: `0 ${theme.spacing.md}`,
  },
  formGroup: {
    marginBottom: theme.spacing.md,
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
    fontSize: theme.font.sizeSm,
    color: theme.color.black,
  },
  fieldRow: {
    display: 'flex',
    gap: theme.spacing.xs,
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  addBtn: {
    background: 'none',
    border: `1px dashed ${theme.color.brandGraniteGray}`,
    padding: `${theme.spacing.xxs} ${theme.spacing.md}`,
    color: theme.color.brandGraniteGray,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
  },
  removeBtn: {
    backgroundColor: theme.color.statusDanger,
    color: theme.color.white,
    border: 'none',
    padding: `${theme.spacing.xxs} ${theme.spacing.sm}`,
  },
  submitBtn: {
    backgroundColor: theme.color.interactiveDefault,
    color: theme.color.white,
    border: 'none',
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    fontSize: theme.font.sizeMd,
    fontWeight: theme.font.weightSemibold,
  },
  message: {
    padding: theme.spacing.sm,
    backgroundColor: '#E8F0FE',
    borderLeft: `4px solid ${theme.color.interactiveDefault}`,
    borderRadius: theme.radius.md,
    color: theme.color.black,
  },
  btnIcon: {
    verticalAlign: 'middle',
    marginRight: '0.3rem',
    fontSize: '1.1em',
  },
};
