import React from 'react';

type InputProps = {
  onChange: (e: string | number) => void;
  label: string;
  placeholder: string;
  type?: 'text' | 'number';
  required?: boolean;
  isSelect?: boolean;
  options?: React.ReactNode | null;
};

export const Input: React.FC<InputProps> = ({
  onChange,
  label,
  placeholder,
  type = 'text',
  required = true,
  isSelect = false,
  options = null,
}) => {
  return (
    <div style={styles.container}>
      <label style={styles.label}>
        {label}
        <span style={styles.required}>{required ? ' *' : ''}</span>
      </label>
      {isSelect ? (
        <select
          required={required}
          onChange={(e) => onChange?.(e.target.value)}
          style={styles.input}
          onFocus={(e) => {
            e.target.style.borderColor = '#4fbcff';
            e.target.style.boxShadow = '0 0 0 2px rgba(79, 188, 255, 0.3)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#444';
            e.target.style.boxShadow = 'none';
          }}
        >
          {options}
        </select>
      ) : (
        <input
          required={required}
          type={type}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          style={styles.input}
          onFocus={(e) => {
            e.target.style.borderColor = '#4fbcff';
            e.target.style.boxShadow = '0 0 0 2px rgba(79, 188, 255, 0.3)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#444';
            e.target.style.boxShadow = 'none';
          }}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontFamily: 'sans-serif',
    marginBottom: '12px',
    color: '#eee',
  } as React.CSSProperties,
  label: {
    fontSize: '14px',
    color: '#ccc',
  } as React.CSSProperties,
  required: {
    color: 'red',
  } as React.CSSProperties,
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #444',
    fontSize: '14px',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  } as React.CSSProperties,
};
