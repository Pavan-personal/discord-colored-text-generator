"use client";

import { useState, useRef } from "react";
import { Tooltip } from "@mantine/core";
import "@mantine/core/styles.css";
import {
  MantineProvider,
  // Tooltip,
  createTheme,
} from "@mantine/core";
const theme = createTheme({
  primaryColor: "indigo",
  defaultRadius: "md",
});

interface ANSIState {
  fg: number;
  bg: number;
  st: number;
}

export default function Home() {
  const textarea = "Welcome to Rebane's Discord Colored Text Generator!";
  const textareaRef = useRef<HTMLDivElement>(null);
  const [copyCount, setCopyCount] = useState(0);
  const [activeNoise, setActiveNoise] = useState(false);

  const tooltipTexts = {
    "30": "Dark Gray",
    "31": "Red",
    "32": "Yellowish Green",
    "33": "Gold",
    "34": "Light Blue",
    "35": "Pink",
    "36": "Teal",
    "37": "White",
    "40": "Blueish Black",
    "41": "Rust Brown",
    "42": "Gray",
    "43": "Soft Gray",
    "44": "Light Gray",
    "45": "Blurple",
    "46": "Pale Gray",
    "47": "Cream White",
  };

  // Rest of the previous functionality remains the same...
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

    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
  };

  const handleCopy = () => {
    if (!textareaRef.current) return;

    // const nodesToANSI = (
    //   nodes: NodeList,
    //   states: any[] = [{ fg: 37, bg: 40, st: 0 }]
    // ): string => {
    const nodesToANSI = (
      nodes: NodeList,
      states: ANSIState[] = [{ fg: 37, bg: 40, st: 0 }]
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
        setActiveNoise(true);
        setCopyCount((prev) => Math.min(11, prev + 1));
        setTimeout(() => setActiveNoise(false), 1000);
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
    <MantineProvider theme={theme}>
      <div className="min-h-screen bg-black text-green-400 overflow-hidden relative">
        {/* Cyberpunk Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-grid-green/10"></div>
        </div>

        {/* Glitch Effect Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">
          {/* Header with Glitch Effect */}
          <h1 className="text-6xl font-bold text-center mb-12 relative">
            <span
              className="block absolute top-0 left-0 text-green-500 opacity-75 glitch-text"
              data-text="Discord Color"
            >
              Discord Color
            </span>
            <span
              className="block text-green-400 glitch-text"
              data-text="Generator"
            >
              Generator
            </span>
          </h1>

          {/* Cyberpunk Info Panel */}
          <div className="bg-black/80 border-2 border-green-500/50 rounded-xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-transparent opacity-20 pointer-events-none"></div>
            <p className="text-green-300 relative z-10">
              Hack the matrix of Discord messaging. Transform your text into a
              neon-infused communication weapon.
            </p>
          </div>

          {/* Control Panel */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Tooltip label="Reset Cybernetic Text">
              <button
                onClick={handleReset}
                className="bg-red-500/20 border-2 border-red-500/50 text-red-300 py-3 rounded-lg hover:bg-red-500/40 transition-all glitch-button"
              >
                Reset Protocol
              </button>
            </Tooltip>

            <Tooltip label="Engage Bold Encryption">
              <button
                onClick={() => handleStyleApply("1")}
                className="bg-blue-500/20 border-2 border-blue-500/50 text-blue-300 py-3 rounded-lg hover:bg-blue-500/40 transition-all glitch-button"
              >
                Bold Cipher
              </button>
            </Tooltip>

            <Tooltip label="Activate Underline Sequence">
              <button
                onClick={() => handleStyleApply("4")}
                className="bg-purple-500/20 border-2 border-purple-500/50 text-purple-300 py-3 rounded-lg hover:bg-purple-500/40 transition-all glitch-button"
              >
                Underline Protocol
              </button>
            </Tooltip>
          </div>

          {/* Color Grids */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Foreground Colors */}
            <div>
              <h2 className="text-2xl mb-4 text-green-500 border-b border-green-500/50 pb-2">
                Foreground Spectrums
              </h2>
              <div className="grid grid-cols-8 gap-3">
                {["30", "31", "32", "33", "34", "35", "36", "37"].map(
                  (code) => (
                    <Tooltip
                      key={code}
                      label={tooltipTexts[code as keyof typeof tooltipTexts]}
                    >
                      <button
                        className="w-12 h-12 rounded-full border-2 border-transparent hover:border-green-500 transition-all"
                        style={{
                          backgroundColor: `var(--ansi-${code})`,
                          color: "white",
                        }}
                        onClick={() => handleStyleApply(code)}
                      >
                        {/* {tooltipTexts[code as keyof typeof tooltipTexts]} */}
                      </button>
                    </Tooltip>
                  )
                )}
              </div>
            </div>

            {/* Background Colors */}
            <div>
              <h2 className="text-2xl mb-4 text-green-500 border-b border-green-500/50 pb-2">
                Background Layers
              </h2>
              <div className="grid grid-cols-8 gap-3">
                {["40", "41", "42", "43", "44", "45", "46", "47"].map(
                  (code) => (
                    <Tooltip
                      key={code}
                      label={tooltipTexts[code as keyof typeof tooltipTexts]}
                    >
                      <button
                        className="w-12 h-12 rounded-full border-2 border-transparent hover:border-green-500 transition-all"
                        style={{
                          backgroundColor: `var(--ansi-${code}-bg)`,
                          color: "white",
                        }}
                        onClick={() => handleStyleApply(code)}
                      ></button>
                    </Tooltip>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Editable Textarea with Cyberpunk Style */}
          <div
            ref={textareaRef}
            contentEditable
            className="mt-8 min-h-[200px] bg-black/80 border-2 border-green-500/50 text-green-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 relative"
          >
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

          {/* Hyper Copy Button */}
          <button
            onClick={handleCopy}
            className={`w-full mt-6 py-4 bg-green-800/50 border-2 border-green-500 text-green-300 rounded-lg 
          hover:bg-green-700/70 transition-all duration-300 relative overflow-hidden 
          ${activeNoise ? "animate-noise" : ""}`}
          >
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
              : "Inject Colored Text"}
          </button>

          <p className="text-center text-green-700 mt-4 text-sm">
            Cybernetic transmission protocol: Unauthorized Discord color
            manipulation engaged.
          </p>
        </div>
      </div>
    </MantineProvider>
  );
}
