// main.js

// Import libraries from node_modules
import Vex from "vexflow";
import * as Tone from "tone";
import PianoChart from "piano-chart";

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

// We'll keep a reference to our piano-chart instance(s)
let pianoScales = null;
let pianoModes = null;

/********************************************************************
 * UTILS: RENDER STAFF WITH VEXFLOW
 ********************************************************************/
function renderStaff(scaleText, containerId) {
  // "C major is: C, D, E, F, G, A, B"
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ""; // clear old

  // parse the portion after " is: "
  const pieces = scaleText.split(" is: ");
  if (pieces.length < 2) {
    container.innerHTML = `<p>Cannot parse: ${scaleText}</p>`;
    return;
  }
  const noteArray = pieces[1].trim().split(",").map(n => n.trim());

  // Setup VexFlow
  const VF = Vex.Flow;
  const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
  renderer.resize(600, 160);
  const context = renderer.getContext();
  context.setFont("Arial", 10).setBackgroundFillStyle("#eed");

  const stave = new VF.Stave(10, 20, 580);
  stave.addClef("treble").setContext(context).draw();

  // Convert e.g. "C#" => "c#/4"
  function toVexKey(noteName) {
    return noteName.toLowerCase() + "/4";
  }

  const vexNotes = noteArray.map(n => new VF.StaveNote({
    clef: "treble",
    keys: [toVexKey(n)],
    duration: "q"
  }));

  const voice = new VF.Voice({ num_beats: vexNotes.length, beat_value: 4 });
  voice.addTickables(vexNotes);
  new VF.Formatter().joinVoices([voice]).format([voice], 550);
  voice.draw(context, stave);
}

/********************************************************************
 * UTILS: PLAY NOTES WITH TONE
 ********************************************************************/
function playScale(scaleText) {
  const pieces = scaleText.split(" is: ");
  if (pieces.length < 2) return;
  const noteArray = pieces[1].trim().split(",").map(n => n.trim());

  const synth = new Tone.Synth().toDestination();
  const now = Tone.now();

  noteArray.forEach((note, i) => {
    // map "C#" => "C#4" 
    synth.triggerAttackRelease(note + "4", "8n", now + i * 0.5);
  });
}

/********************************************************************
 * UTILS: INIT PIANO-CHART AND HIGHLIGHT KEYS
 ********************************************************************/
function initPiano(divId) {
  const el = document.getElementById(divId);
  if (!el) return null;

  // create a new PianoChart instance
  const piano = new PianoChart({
    element: el,
    octaves: 2,
    startOctave: 3
  });
  return piano;
}

function highlightKeys(pianoInstance, scaleText) {
  if (!pianoInstance) return;

  const pieces = scaleText.split(" is: ");
  if (pieces.length < 2) return;
  const noteArray = pieces[1].trim().split(",").map(n => n.trim());

  // Clear old highlights
  pianoInstance.resetHighlights();
  // highlight e.g. "c#4", "d4" ...
  const highlights = noteArray.map(n => n.toLowerCase() + "4");
  pianoInstance.highlight(highlights, "blue");
}

/********************************************************************
 * PAGE-SPECIFIC LOGIC: SCALES
 ********************************************************************/
const scaleForm = document.getElementById("scaleForm");
if (scaleForm) {
  // init the piano for scales
  pianoScales = initPiano("pianoDiv");

  scaleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const root = document.getElementById("scaleRoot").value;
    const scaleType = document.getElementById("scaleType").value;

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
    renderStaff(output, "scaleStaff");
    // highlight piano
    highlightKeys(pianoScales, output);
  });

  // PLAY button
  const playScaleBtn = document.getElementById("playScaleBtn");
  playScaleBtn.addEventListener("click", () => {
    const text = document.getElementById("scaleResult").textContent;
    if (text) {
      // must resume audio context after user gesture
      Tone.start();
      playScale(text);
    }
  });
}

/********************************************************************
 * PAGE-SPECIFIC LOGIC: MODES
 ********************************************************************/
const modeForm = document.getElementById("modeForm");
if (modeForm) {
  // init piano for modes
  pianoModes = initPiano("pianoModeDiv");

  modeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const root = document.getElementById("modeRoot").value;
    const modeType = document.getElementById("modeType").value;

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
    renderStaff(output, "modeStaff");
    // highlight piano
    highlightKeys(pianoModes, output);
  });

  // PLAY mode
  const playModeBtn = document.getElementById("playModeBtn");
  playModeBtn.addEventListener("click", () => {
    const text = document.getElementById("modeResult").textContent;
    if (text) {
      Tone.start();
      playScale(text);
    }
  });
}
