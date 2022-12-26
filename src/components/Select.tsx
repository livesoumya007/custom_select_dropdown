import { log } from "console";
import { useEffect, useRef, useState } from "react";
import styles from "./select.module.css";

export interface SelectOptions {
  label: string;
  value: string;
}

type SingleSelectProps = {
    multiple?: false;
    value?: SelectOptions;
    onChange: (value: SelectOptions | undefined) => void;
}

type MultiSelectProps = {
    multiple: true
    value: SelectOptions[];
    onChange: (value: SelectOptions[] | undefined) => void;

}

type SelectProps = {
  options: SelectOptions[];
} & (SingleSelectProps | MultiSelectProps);

export default function Select({ multiple, value, onChange, options }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const handler = (e: KeyboardEvent) => {
        if(e.target !== containerRef.current) {
            return;
        }
        switch(e.code){
            case 'Enter':
                setIsOpen(prev => !prev);
                if(isOpen){
                    console.log('2nd check');                    
                    selectOption(e, options[highlightedIndex]);
                }
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                if(!isOpen){
                    setIsOpen(true)
                    break;
                }
                const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);
                if(newValue >= 0 && newValue < options.length){
                    setHighlightedIndex(newValue)
                }
                break;
        }
    }
    containerRef.current?.addEventListener("keydown", handler);
    return () => containerRef.current?.removeEventListener('keydown', handler);
  }, [isOpen, highlightedIndex, options]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [isOpen]);
 console.log('check ');
 
  const removeAll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    multiple ? onChange([]) : onChange(undefined);
  };

  const selectOption = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent> | KeyboardEvent ,
    option: SelectOptions
  ) => {
    console.log('type of e ', typeof e);
    
    e?.stopPropagation();
    console.log('why not working ');

    if (multiple) {
        if (value.includes(option)) {
          onChange(value.filter(o => o !== option))
        } else {
            console.log('why not working ');
            
          onChange([...value, option])
        }
      }else{
        if(option !== value){
        e.stopPropagation();
        setIsOpen(false);
        onChange(option);
        }
    }
  };

  const isSelected = (option: SelectOptions): boolean => {
    return multiple ? value.includes(option) : option === value;
  };

  const highlight = (index: number) => {
    return highlightedIndex === index;
  };

  return (
    <div
      ref = {containerRef}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
      className={styles.container}
      tabIndex={0}
    >
      <span className={styles.value}> { multiple  ? value.map(v => <button className={styles.optionBadge} key={v.value} onClick={e => selectOption(e,v)}>{v.label}<span className={styles.removeBtn}>&times;</span></button>) : value?.label} </span>
      <button onClick={removeAll} className={styles.close}>
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options}  ${isOpen && styles.show}`}>
        {options.map((o, index) => {
          return (
            <li
              key={o.value}  
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={(e) => selectOption(e, o)}
              className={`${styles.option}
                 ${isSelected(o) ? styles.selected : ""} ${
                highlight(index) ? styles.highlighted : ""
              }`}
            >
              {o.label}{" "}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
