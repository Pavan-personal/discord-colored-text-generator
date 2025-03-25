// src/app/page.tsx
"use client";

import { useState, useRef, useCallback } from "react";

export default function Home() {
  const [textarea, setTextarea] = useState<string>(
    "Welcome to Rebane's Discord Colored Text Generator!"
  );
  const textareaRef = useRef<HTMLDivElement>(null);
  const [copyCount, setCopyCount] = useState(0);

  const tooltipTexts = {
    "30": "Dark Gray (33%)",
    "31": "Red",
    "32": "Yellowish Green",
    "33": "Gold",
    "34": "Light Blue",
    "35": "Pink",
    "36": "Teal",
    "37": "White",
    "40": "Blueish Black",
    "41": "Rust Brown",
    "42": "Gray (40%)",
    "43": "Gray (45%)",
    "44": "Light Gray (55%)",
    "45": "Blurple",
    "46": "Light Gray (60%)",
    "47": "Cream White",
  };

  const handleStyleApply = (ansiCode: string) => {
    if (!window.getSelection) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (!selectedText) return;

    const span = document.createElement("span");
    span.className = `ansi-${ansiCode}`;
    span.textContent = selectedText;

    range.deleteContents();
    range.insertNode(span);

    // Reselect the styled text
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
  };

  const handleCopy = () => {
    if (!textareaRef.current) return;

    const nodesToANSI = (
      nodes: NodeList,
      states: any[] = [{ fg: 37, bg: 40, st: 0 }]
    ): string => {
      let text = "";

      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent || "";
          return;
        }

        if (node.nodeName === "BR") {
          text += "\n";
          return;
        }

        if (node instanceof HTMLElement) {
          const ansiCode = node.className.split("-")[1]
            ? parseInt(node.className.split("-")[1])
            : 0;
          const newState = { ...states[states.length - 1] };

          if (ansiCode < 30) newState.st = ansiCode;
          if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
          if (ansiCode >= 40) newState.bg = ansiCode;

          states.push(newState);

          text += `\x1b[${newState.st};${
            ansiCode >= 40 ? newState.bg : newState.fg
          }m`;
          text += nodesToANSI(node.childNodes, states);
          states.pop();

          text += "\x1b[0m";

          if (states[states.length - 1].fg !== 37) {
            text += `\x1b[${states[states.length - 1].st};${
              states[states.length - 1].fg
            }m`;
          }
          if (states[states.length - 1].bg !== 40) {
            text += `\x1b[${states[states.length - 1].st};${
              states[states.length - 1].bg
            }m`;
          }
        }
      });

      return text;
    };

    const toCopy =
      "```ansi\n" + nodesToANSI(textareaRef.current.childNodes) + "\n```";

    navigator.clipboard
      .writeText(toCopy)
      .then(() => {
        const funnyCopyMessages = [
          "Copied!",
          "Double Copy!",
          "Triple Copy!",
          "Dominating!!",
          "Rampage!!",
          "Mega Copy!!",
          "Unstoppable!!",
          "Wicked Sick!!",
          "Monster Copy!!!",
          "GODLIKE!!!",
          "BEYOND GODLIKE!!!!",
        ];

        setCopyCount((prev) => Math.min(11, prev + 1));
      })
      .catch(() => {
        alert("Copying failed, here's the text: " + toCopy);
      });
  };

  const handleReset = () => {
    if (textareaRef.current) {
      textareaRef.current.innerText = textarea;
    }
  };

  return (
    <div className="container">
      <h1>
        Rebane&apos;s Discord <span style={{ color: "#5865F2" }}>Colored</span>{" "}
        Text Generator
      </h1>

      <div>
        <h3>About</h3>
        <p>
          This is a simple app that creates colored Discord messages using the
          ANSI color codes available on the latest Discord desktop versions.
        </p>
        <p>
          To use this, write your text, select parts of it and assign colors to
          them, then copy it using the button below, and send in a Discord
          message.
        </p>
      </div>

      <div>
        <button onClick={handleReset}>Reset All</button>
        <button onClick={() => handleStyleApply("1")}>Bold</button>
        <button onClick={() => handleStyleApply("4")}>Line</button>
      </div>

      <div>
        <strong>Foreground Colors</strong>
        {["30", "31", "32", "33", "34", "35", "36", "37"].map((code) => {
          return (
            <button
              key={code}
              // good tailwind style in className
              className="text-white p-2 "
              onClick={() => handleStyleApply(code)}
              style={{ backgroundColor: `var(--ansi-${code})` }}
            >{code}</button>
          );
        })}
      </div>

      <div>
        <strong>Background Colors</strong>
        {["40", "41", "42", "43", "44", "45", "46", "47"].map((code) => (
          <button
            key={code}
            onClick={() => handleStyleApply(code)}
            style={{ backgroundColor: `var(--ansi-${code}-bg)` }}
          >{code}</button>
        ))}
      </div>

      <div ref={textareaRef} contentEditable className="textarea">
        Welcome to <span className="ansi-33">Rebane</span>&apos;s{" "}
        <span className="ansi-45">
          <span className="ansi-37">Discord</span>
        </span>
        &nbsp;<span className="ansi-31">C</span>
        <span className="ansi-32">o</span>
        <span className="ansi-33">l</span>
        <span className="ansi-34">o</span>
        <span className="ansi-35">r</span>
        <span className="ansi-36">e</span>
        <span className="ansi-37">d</span>&nbsp;Text Generator!
      </div>

      <button onClick={handleCopy}>
        {copyCount > 0
          ? [
              "Copied!",
              "Double Copy!",
              "Triple Copy!",
              "Dominating!!",
              "Rampage!!",
              "Mega Copy!!",
              "Unstoppable!!",
              "Wicked Sick!!",
              "Monster Copy!!!",
              "GODLIKE!!!",
              "BEYOND GODLIKE!!!!",
            ][copyCount - 1]
          : "Copy text as Discord formatted"}
      </button>

      <p>This is an unofficial tool, it is not made or endorsed by Discord.</p>
    </div>
  );
}
