import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

/**
 * ComboBox Component from Sera UI (https://seraui.com/registry/combo-box.json)
 * Enhanced with support for object options ({ value, label }), controlled value,
 * and keyboard navigation (ArrowDown, ArrowUp, Enter, Escape).
 */
export const ComboBox = ({
  options = [],
  value,
  placeholder = "Select an option...",
  onSelect,
  onChange,
  className = "",
  disabled = false,
  id
}) => {
  // Normalize options to uniform { value, label } items
  const normalizedOptions = useMemo(() => {
    return options.map(opt => {
      if (typeof opt === 'object' && opt !== null) {
        return {
          value: opt.value !== undefined ? String(opt.value) : String(opt.id || ''),
          label: opt.label !== undefined ? String(opt.label) : String(opt.name || opt.value || '')
        };
      }
      return {
        value: String(opt),
        label: String(opt)
      };
    });
  }, [options]);

  // Derived selected option based on controlled value prop
  const currentOption = useMemo(() => {
    if (value === undefined || value === null || value === '') return null;
    return normalizedOptions.find(o => o.value === String(value)) || null;
  }, [value, normalizedOptions]);

  const [isOpen, setIsOpen] = useState(false);
  const [typedQuery, setTypedQuery] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const comboBoxRef = useRef(null);
  const optionRefs = useRef([]);

  // Active text in the input
  const displayValue = typedQuery !== null ? typedQuery : (currentOption ? currentOption.label : '');

  // Derived filtered options
  const filteredOptions = useMemo(() => {
    if (!isOpen || typedQuery === null || typedQuery === '') return normalizedOptions;
    const query = typedQuery.toLowerCase();
    return normalizedOptions.filter(o =>
      o.label.toLowerCase().includes(query) ||
      o.value.toLowerCase().includes(query)
    );
  }, [normalizedOptions, typedQuery, isOpen]);

  // Scroll to highlighted option
  useEffect(() => {
    if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  // Close when clicking outside
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTypedQuery(null);
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        comboBoxRef.current &&
        !comboBoxRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClose]);

  const handleInputChange = (e) => {
    setTypedQuery(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true);
      if (filteredOptions.length > 0) {
        setHighlightedIndex(
          e.key === "ArrowDown" ? 0 : filteredOptions.length - 1
        );
      }
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (filteredOptions.length > 0) {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (filteredOptions.length > 0) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
      case "Tab":
        handleClose();
        break;
    }
  };

  const handleOptionSelect = (option) => {
    setTypedQuery(null);
    setIsOpen(false);
    setHighlightedIndex(-1);
    
    // Trigger callbacks with selected value
    if (onSelect) onSelect(option.value, option);
    if (onChange) onChange(option.value, option);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleClearSelection = (e) => {
    e.stopPropagation();
    setTypedQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onSelect) onSelect(null);
    if (onChange) onChange(null);
  };

  return (
    <div className={`relative w-full ${className}`} ref={comboBoxRef}>
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          value={displayValue}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-9.5 px-3.5 pr-14 border border-slate-200 bg-white text-slate-800 text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-2xs placeholder-slate-400 cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
          {currentOption && !disabled && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="p-1 hover:text-slate-600 transition-colors cursor-pointer rounded"
              aria-label="Clear selection"
            >
              <X size={13} />
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:text-slate-600 transition-colors cursor-pointer rounded"
            aria-label="Toggle dropdown"
          >
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-sky-600" : ""}`}
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto py-1 animate-fade-in"
          role="listbox"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const isSelected = currentOption?.value === option.value;
              const isHighlighted = index === highlightedIndex;

              return (
                <button
                  key={`${option.value}-${index}`}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  id={`option-${index}`}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex items-center justify-between cursor-pointer border-0 ${
                    isHighlighted
                      ? "bg-sky-50 text-sky-700 font-bold"
                      : isSelected
                      ? "bg-sky-50/70 text-sky-700 font-bold"
                      : "text-slate-700 hover:bg-slate-50 font-medium"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check size={14} className="text-sky-600 shrink-0 ml-2" />}
                </button>
              );
            })
          ) : (
            <div
              className="px-3.5 py-3 text-xs text-slate-400 text-center"
              role="status"
            >
              Tidak ditemukan pilihan
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComboBox;
