// main.js

// Import libraries (Vite or local modules)
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  KeySignature
} from "vexflow";
import * as Tone from "tone";
import { Instrument } from "piano-chart";

// Import your scale logic
import {
  majorScale,
  naturalMinorScale,
  harmonicMinorScale,
  melodicMinorScale,
  chromaticScale,
  dorianScale,
  phrygianScale,
  lydianScale,
  mixolydianScale
} from "./scalelogic.js";

/********************************************************************
 * 1) A narrower note+octave array: from C4 through B6
 *    so that "middle C" lines up with one ledger line below treble staff.
 ********************************************************************/
const ALL_NOTES_WITH_OCTAVES = [
  "C4","C#4","Db4","D4","D#4","Eb4","E4","Fb4","F4","F#4","Gb4","G4","G#4","Ab4","A4","A#4","Bb4","B4",
  "C5","C#5","Db5","D5","D#5","Eb5","E5","Fb5","F5","F#5","Gb5","G5","G#5","Ab5","A5","A#5","Bb5","B5",
  "C6","C#6","Db6","D6","D#6","Eb6","E6","Fb6","F6","F#6","Gb6","G6","G#6","Ab6","A6","A#6","Bb6","B6"
];

// We’ll map flats to sharps in order to locate them in ALL_NOTES_WITH_OCTAVES easily.
function normalizeToSharp(noteName) {
  return noteName
    .replace(/^Db$/i, "C#")
    .replace(/^Eb$/i, "D#")
    .replace(/^Gb$/i, "F#")
    .replace(/^Ab$/i, "G#")
    .replace(/^Bb$/i, "A#");
}

/********************************************************************
 * 2) Convert text scale → array of ascending pitch strings for VexFlow
 ********************************************************************/
function createAscendingVexKeys(scaleText) {
  const pieces = scaleText.split(" is: ");
  if (pieces.length < 2) return [];
  const noteArray = pieces[1].trim().split(",").map(n => n.trim());

  // Start searching from the first occurrence at or after C4
  const firstNote = normalizeToSharp(noteArray[0]);
  let startIndex = 0;
  // We find the earliest place in ALL_NOTES_WITH_OCTAVES
  // that matches the root, or default to 0 if not found.
  let foundIndex = ALL_NOTES_WITH_OCTAVES.findIndex(n => n.startsWith(firstNote));
  if (foundIndex < 0) foundIndex = 0;
  startIndex = foundIndex;

  let currentSearchIndex = startIndex;
  const vexKeys = [];

  noteArray.forEach(rawNote => {
    const sharpEquivalent = normalizeToSharp(rawNote);
    // from currentSearchIndex forward, find the next matching prefix
    let foundPos = -1;
    for (let i = currentSearchIndex; i < ALL_NOTES_WITH_OCTAVES.length; i++) {
      if (ALL_NOTES_WITH_OCTAVES[i].startsWith(sharpEquivalent)) {
        foundPos = i;
        break;
      }
    }
    if (foundPos === -1) {
      // If we fail, just push "c/4" as fallback
      vexKeys.push("c/4");
    } else {
      const full = ALL_NOTES_WITH_OCTAVES[foundPos]; // e.g. "C#4"
      const oct = full.slice(-1); // last character is the octave
      const notePart = full.slice(0, full.length - 1); // e.g. "C#" or "Db"
      const letter = notePart[0].toLowerCase();
      const accidental = notePart.slice(1); // e.g. "#"

      vexKeys.push(letter + accidental + "/" + oct);
      currentSearchIndex = foundPos + 1;
    }
  });

  return vexKeys;
}

/********************************************************************
 * 3) Compute staff width dynamically & get key signature
 ********************************************************************/
function computeStaffWidth(numNotes) {
  const minWidth = 600;
  const widthPerNote = 60;
  const w = numNotes * widthPerNote;
  return w < minWidth ? minWidth : w;
}

// A simple map from root+scaleType → the string VexFlow uses.
function getKeySignature(root, scaleType) {
  const keyMap = {
    // major keys
    "Cmajor": "C",
    "Gmajor": "G",
    "Dmajor": "D",
    "Amajor": "A",
    "Emajor": "E",
    "Bmajor": "B",
    "F#major": "F#",
    "C#major": "C#",
    "Fmajor": "F",
    "Bbmajor": "Bb",
    "Ebmajor": "Eb",
    "Abmajor": "Ab",
    "Dbmajor": "Db",
    "Gbmajor": "Gb",
    // natural minors
    "AnaturalMinor": "Am",
    "EnaturalMinor": "Em",
    "BnaturalMinor": "Bm",
    "F#naturalMinor": "F#m",
    "C#naturalMinor": "C#m",
    "G#naturalMinor": "G#m",
    "D#naturalMinor": "D#m",
    "A#naturalMinor": "A#m",
    "DnaturalMinor": "Dm",
    "GnaturalMinor": "Gm",
    "CnaturalMinor": "Cm",
    "FnaturalMinor": "Fm",
    "BbnaturalMinor": "Bbm",
    "EbnaturalMinor": "Ebm",
    "AbnaturalMinor": "Abm"
    // Expand if needed for harmonic/melodic or for modes.
  };
  const cleanRoot = root.replace(/\s+/g, "");
  const key = cleanRoot + scaleType;
  return keyMap[key] || "";
}

/********************************************************************
 * 4) Render staff with VexFlow
 ********************************************************************/
function renderStaff(scaleText, containerId, clef, scaleType, rootNote) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ""; // clear old content

  const vexKeys = createAscendingVexKeys(scaleText);
  if (!vexKeys.length) {
    container.innerHTML = `<p style="color:red;">No valid notes to render.</p>`;
    return;
  }

  const width = computeStaffWidth(vexKeys.length);
  const renderer = new Renderer(container, Renderer.Backends.SVG);

  // Slightly taller so ledger lines for C4 etc. aren't cut off
  renderer.resize(width, 220);

  const context = renderer.getContext();
  context.setFont("Arial", 10).setBackgroundFillStyle("#f8f8f8");

  const stave = new Stave(10, 20, width - 20);
  stave.addClef(clef);

  // Add key signature for certain scale types
  const vexflowKeySig = getKeySignature(rootNote, scaleType);
  if (vexflowKeySig) {
    stave.addKeySignature(vexflowKeySig);
  }

  stave.setContext(context).draw();

  const notes = vexKeys.map(k => new StaveNote({
    clef: clef,
    keys: [k],
    duration: "q"
  }));

  const voice = new Voice({ numBeats: notes.length, beatValue: 4 });
  voice.addTickables(notes);

  new Formatter().joinVoices([voice]).format([voice], width - 60);
  voice.draw(context, stave);
}

/********************************************************************
 * 5) Play notes with Tone.js
 ********************************************************************/
function playScale(scaleText) {
  const pieces = scaleText.split(" is: ");
  if (pieces.length < 2) return;
  const noteArray = pieces[1].trim().split(",").map(n => n.trim());

  const synth = new Tone.Synth().toDestination();
  const now = Tone.now();

  // We’ll just do everything in octave 4 for audio
  noteArray.forEach((note, i) => {
    synth.triggerAttackRelease(note + "4", "8n", now + i * 0.5);
  });
}

/********************************************************************
 * 6) Piano-chart highlighting
 ********************************************************************/
function initPiano(divId) {
  const el = document.getElementById(divId);
  if (!el) return null;

  return new Instrument({
    element: el,
    octaves: 2,
    startOctave: 3,
    whiteKeyColor: '#ffffff',
    blackKeyColor: '#444444',
    highlightColor: '#58cc02'
  });
}

function highlightKeys(pianoInstance, scaleText) {
  if (!pianoInstance) return;

  const pieces = scaleText.split(" is: ");
  if (pieces.length < 2) return;
  const noteArray = pieces[1].trim().split(",").map(n => n.trim());

  pianoInstance.resetHighlights();
  const highlights = noteArray.map(n => n.toLowerCase() + "4");
  pianoInstance.highlight(highlights, "blue");
}

/********************************************************************
 * 7) Scales page
 ********************************************************************/
let pianoScales = null;
const scaleForm = document.getElementById("scaleForm");
if (scaleForm) {
  pianoScales = initPiano("pianoDiv");

  scaleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const root = document.getElementById("scaleRoot").value.trim();
    const scaleType = document.getElementById("scaleType").value;
    const clef = document.getElementById("scaleClef").value;

    let output = "";
    switch (scaleType) {
      case "major":
        output = majorScale(root);
        break;
      case "naturalMinor":
        output = naturalMinorScale(root);
        break;
      case "harmonicMinor":
        output = harmonicMinorScale(root);
        break;
      case "melodicMinor":
        output = melodicMinorScale(root);
        break;
      case "chromatic":
        output = chromaticScale(root);
        break;
      default:
        output = `No logic for ${scaleType}`;
    }

    const scaleResult = document.getElementById("scaleResult");
    scaleResult.textContent = output;

    // Render staff
    renderStaff(output, "scaleStaff", clef, scaleType, root);

    // highlight piano
    highlightKeys(pianoScales, output);
  });

  const playScaleBtn = document.getElementById("playScaleBtn");
  playScaleBtn.addEventListener("click", () => {
    const text = document.getElementById("scaleResult").textContent;
    if (text) {
      Tone.start();
      playScale(text);
    }
  });
}

/********************************************************************
 * 8) Modes page
 ********************************************************************/
let pianoModes = null;
const modeForm = document.getElementById("modeForm");
if (modeForm) {
  pianoModes = initPiano("pianoModeDiv");

  modeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const root = document.getElementById("modeRoot").value.trim();
    const modeType = document.getElementById("modeType").value;
    const clef = document.getElementById("modeClef").value;

    let output = "";
    switch (modeType) {
      case "dorian":
        output = dorianScale(root);
        break;
      case "phrygian":
        output = phrygianScale(root);
        break;
      case "lydian":
        output = lydianScale(root);
        break;
      case "mixolydian":
        output = mixolydianScale(root);
        break;
      default:
        output = `No logic for ${modeType}`;
    }

    const modeResult = document.getElementById("modeResult");
    modeResult.textContent = output;

    // Render staff
    renderStaff(output, "modeStaff", clef, modeType, root);

    // highlight piano
    highlightKeys(pianoModes, output);
  });

  const playModeBtn = document.getElementById("playModeBtn");
  playModeBtn.addEventListener("click", () => {
    const text = document.getElementById("modeResult").textContent;
    if (text) {
      Tone.start();
      playScale(text);
    }
  });
}
