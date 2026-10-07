import React from 'react';
export const Toggle = ({
  checked,
  defaultChecked,
  onChange,
  size = 'md',
  color = 'primary',
  label,
  labelPosition = 'right',
  disabled = false,
  icons,
  className = '',
  id,
  name,
  title,
  ...props
}) => {
  const sizeClass = size ? `toggle-${size}` : '';
  const colorClass = color ? `toggle-${color}` : '';

  // If icons are provided, daisyUI expects <label class="toggle"><input ... /> {iconEnabled} {iconDisabled}</label>
  if (icons && (icons.enabled || icons.disabled)) {
    const inputElement = (
      <label className={`toggle ${sizeClass} ${colorClass} ${className} cursor-pointer`}>
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          title={title}
          {...props}
        />
        {icons.enabled}
        {icons.disabled}
      </label>
    );

    if (!label) return inputElement;

    return (
      <label className={`inline-flex items-center gap-2 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {labelPosition === 'left' && <span className="text-xs font-medium text-slate-700">{label}</span>}
        {inputElement}
        {labelPosition === 'right' && <span className="text-xs font-medium text-slate-700">{label}</span>}
      </label>
    );
  }

  const inputElement = (
    <input
      id={id}
      name={name}
      type="checkbox"
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange}
      disabled={disabled}
      title={title}
      className={`toggle ${sizeClass} ${colorClass} ${className}`}
      {...props}
    />
  );

  if (!label) return inputElement;

  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {labelPosition === 'left' && <span className="text-xs font-medium text-slate-700">{label}</span>}
      {inputElement}
      {labelPosition === 'right' && <span className="text-xs font-medium text-slate-700">{label}</span>}
    </label>
  );
};

export default Toggle;
