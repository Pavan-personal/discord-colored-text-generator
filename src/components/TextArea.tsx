// src/components/TextArea.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import styles from '@/app/page.module.css';

// ANSI conversion utility
function convertToAnsi(element: HTMLDivElement): string {
  const traverseNodes = (nodes: NodeList): string => {
    let text = '';
    
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || '';
      } else if (node.nodeName === 'BR') {
        text += '\n';
      } else if (node instanceof HTMLElement) {
        const classes = node.className.split(' ');
        const ansiClass = classes.find(cls => cls.startsWith('ansi-'));
        
        if (ansiClass) {
          const ansiCode = ansiClass.split('-')[1];
          text += `\x1b[${ansiCode}m${traverseNodes(node.childNodes)}\x1b[0m`;
        }
      }
    });
    
    return text;
  };

  return `\`\`\`ansi\n${traverseNodes(element.childNodes)}\n\`\`\``;
}

export default function TextArea() {
  const [copyCount, setCopyCount] = useState(0);
  const textAreaRef = useRef<HTMLDivElement>(null);
  
  const funnyCopyMessages = [
    'Copied!', 'Double Copy!', 'Triple Copy!', 
    'Dominating!!', 'Rampage!!', 'Mega Copy!!', 
    'Unstoppable!!', 'Wicked Sick!!', 'Monster Copy!!!', 
    'GODLIKE!!!', 'BEYOND GODLIKE!!!!'
  ];

  const handleCopy = useCallback(() => {
    if (textAreaRef.current) {
      const ansiText = convertToAnsi(textAreaRef.current);
      
      navigator.clipboard.writeText(ansiText).then(() => {
        setCopyCount(prev => Math.min(11, prev + 1));
      }).catch(() => {
        alert('Copying failed. Here is the text: ' + ansiText);
      });
    }
  }, []);

  const handleStyleApply = useCallback((ansiCode: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (!selectedText) return;

    const span = document.createElement('span');
    span.className = `ansi-${ansiCode}`;
    span.textContent = selectedText;

    range.deleteContents();
    range.insertNode(span);

    // Reselect the styled text
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }, []);

  const foregroundColors = ['30', '31', '32', '33', '34', '35', '36', '37'];
  const backgroundColors = ['40', '41', '42', '43', '44', '45', '46', '47'];

  return (
    <div className={styles.container}>
      <div 
        ref={textAreaRef}
        contentEditable 
        className={styles.textArea}
      >
        Welcome to <span className="ansi-33">Rebane</span>'s <span className="ansi-45 ansi-37">Discord</span> <span className="ansi-31">C</span><span className="ansi-32">o</span><span className="ansi-33">l</span><span className="ansi-34">o</span><span className="ansi-35">r</span><span className="ansi-36">e</span><span className="ansi-37">d</span> Text Generator!
      </div>

      <div>
        <button 
          onClick={() => handleStyleApply('1')} 
          className={styles.button}
        >
          Bold
        </button>
        <button 
          onClick={() => handleStyleApply('4')} 
          className={styles.button}
        >
          Underline
        </button>
      </div>

      <div>
        <h3>Foreground Colors</h3>
        <div className={styles.colorGrid}>
          {foregroundColors.map(color => (
            <button
              key={color}
              className={styles.colorButton}
              style={{ backgroundColor: `var(--ansi-${color})` }}
              onClick={() => handleStyleApply(color)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3>Background Colors</h3>
        <div className={styles.colorGrid}>
          {backgroundColors.map(color => (
            <button
              key={color}
              className={styles.colorButton}
              style={{ backgroundColor: `var(--ansi-${color}-bg)` }}
              onClick={() => handleStyleApply(color)}
            />
          ))}
        </div>
      </div>

      <button 
        onClick={handleCopy} 
        className={styles.button}
      >
        {funnyCopyMessages[copyCount] || 'Copy Discord Formatted'}
      </button>
    </div>
  );
}