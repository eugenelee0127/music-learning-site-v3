// scalelogic.js

import {
  sharped_two_octave_chromatic,
  flatted_two_octave_chromatic
} from "./data.js";

/*******************************************************************
 * 1) MAJOR SCALE
 *******************************************************************/
export function majorScale(p_root_note) {
  // Single-letter root
  if (p_root_note.length === 1) {
    // Cases like: C, G, D, A, E, B => use sharp array
    if (["C","G","D","A","E","B"].includes(p_root_note)) {
      for (let note of sharped_two_octave_chromatic) {
        if (p_root_note === note) {
          let tonic_index = sharped_two_octave_chromatic.indexOf(p_root_note);
          return (
            p_root_note + " Major is: " +
            sharped_two_octave_chromatic[tonic_index] + ", " +
            sharped_two_octave_chromatic[tonic_index + 2] + ", " +
            sharped_two_octave_chromatic[tonic_index + 4] + ", " +
            sharped_two_octave_chromatic[tonic_index + 5] + ", " +
            sharped_two_octave_chromatic[tonic_index + 7] + ", " +
            sharped_two_octave_chromatic[tonic_index + 9] + ", " +
            sharped_two_octave_chromatic[tonic_index + 11]
          );
        }
      }
    }
    // Cases like F => use flat array
    else if (["F"].includes(p_root_note)) {
      for (let note of flatted_two_octave_chromatic) {
        if (p_root_note === note) {
          let tonic_index = flatted_two_octave_chromatic.indexOf(p_root_note);
          return (
            p_root_note + " Major is: " +
            flatted_two_octave_chromatic[tonic_index] + ", " +
            flatted_two_octave_chromatic[tonic_index + 2] + ", " +
            flatted_two_octave_chromatic[tonic_index + 4] + ", " +
            flatted_two_octave_chromatic[tonic_index + 5] + ", " +
            flatted_two_octave_chromatic[tonic_index + 7] + ", " +
            flatted_two_octave_chromatic[tonic_index + 9] + ", " +
            flatted_two_octave_chromatic[tonic_index + 11]
          );
        }
      }
    }
  }
  // Root note with accidental (# or b)
  else {
    if (p_root_note[1] === "#") {
      // Use sharps
      for (let note of sharped_two_octave_chromatic) {
        if (p_root_note === note) {
          let tonic_index = sharped_two_octave_chromatic.indexOf(p_root_note);
          return (
            p_root_note + " Major is: " +
            sharped_two_octave_chromatic[tonic_index] + ", " +
            sharped_two_octave_chromatic[tonic_index + 2] + ", " +
            sharped_two_octave_chromatic[tonic_index + 4] + ", " +
            sharped_two_octave_chromatic[tonic_index + 5] + ", " +
            sharped_two_octave_chromatic[tonic_index + 7] + ", " +
            sharped_two_octave_chromatic[tonic_index + 9] + ", " +
            sharped_two_octave_chromatic[tonic_index + 11]
          );
        }
      }
    }
    else if (p_root_note[1] === "b") {
      // Use flats
      for (let note of flatted_two_octave_chromatic) {
        if (p_root_note === note) {
          let tonic_index = flatted_two_octave_chromatic.indexOf(p_root_note);
          return (
            p_root_note + " Major is: " +
            flatted_two_octave_chromatic[tonic_index] + ", " +
            flatted_two_octave_chromatic[tonic_index + 2] + ", " +
            flatted_two_octave_chromatic[tonic_index + 4] + ", " +
            flatted_two_octave_chromatic[tonic_index + 5] + ", " +
            flatted_two_octave_chromatic[tonic_index + 7] + ", " +
            flatted_two_octave_chromatic[tonic_index + 9] + ", " +
            flatted_two_octave_chromatic[tonic_index + 11]
          );
        }
      }
    }
  }
  return "Unable to find a Major scale for " + p_root_note;
}

/*******************************************************************
 * 2) NATURAL MINOR SCALE
 *******************************************************************/
export function naturalMinorScale(p_root_note) {
  let isSharp = sharped_two_octave_chromatic.includes(p_root_note);
  let arr = isSharp ? sharped_two_octave_chromatic : flatted_two_octave_chromatic;

  let tonic_index = arr.indexOf(p_root_note);
  if (tonic_index < 0) {
    return "Unable to find a natural minor scale for " + p_root_note;
  }

  let intervals = [2,1,2,2,1,2,2];
  let notes = [arr[tonic_index]];
  let currentIndex = tonic_index;
  for (let step of intervals) {
    currentIndex += step;
    notes.push(arr[currentIndex]);
  }
  return p_root_note + " natural minor is: " + notes.join(", ");
}

/*******************************************************************
 * 3) HARMONIC MINOR SCALE (intervals 2,1,2,2,1,3,1)
 *******************************************************************/
export function harmonicMinorScale(p_root_note) {
  let isSharp = sharped_two_octave_chromatic.includes(p_root_note);
  let arr = isSharp ? sharped_two_octave_chromatic : flatted_two_octave_chromatic;

  let tonic_index = arr.indexOf(p_root_note);
  if (tonic_index < 0) {
    return "Unable to find a harmonic minor scale for " + p_root_note;
  }

  let intervals = [2,1,2,2,1,3,1];
  let notes = [arr[tonic_index]];
  let currentIndex = tonic_index;
  for (let step of intervals) {
    currentIndex += step;
    notes.push(arr[currentIndex]);
  }
  return p_root_note + " harmonic minor is: " + notes.join(", ");
}

/*******************************************************************
 * 4) MELODIC MINOR SCALE
 *******************************************************************/
export function melodicMinorScale(p_root_note) {
  // Single-letter root
  if (p_root_note.length === 1) {
    if (["A","E","B","D"].includes(p_root_note)) {
      // use sharps
      for (let note of sharped_two_octave_chromatic) {
        if (p_root_note === note) {
          let tonic_index = sharped_two_octave_chromatic.indexOf(p_root_note);
          return (
            p_root_note + " melodic minor is: " +
            sharped_two_octave_chromatic[tonic_index] + ", " +
            sharped_two_octave_chromatic[tonic_index + 2] + ", " +
            sharped_two_octave_chromatic[tonic_index + 3] + ", " +
            sharped_two_octave_chromatic[tonic_index + 5] + ", " +
            sharped_two_octave_chromatic[tonic_index + 7] + ", " +
            sharped_two_octave_chromatic[tonic_index + 9] + ", " +
            sharped_two_octave_chromatic[tonic_index + 11]
          );
        }
      }
    }
    else if (["F","C"].includes(p_root_note)) {
      // use flats
      for (let note of flatted_two_octave_chromatic) {
        if (p_root_note === note) {
          let tonic_index = flatted_two_octave_chromatic.indexOf(p_root_note);
          return (
            p_root_note + " melodic minor is: " +
            flatted_two_octave_chromatic[tonic_index] + ", " +
            flatted_two_octave_chromatic[tonic_index + 2] + ", " +
            flatted_two_octave_chromatic[tonic_index + 3] + ", " +
            flatted_two_octave_chromatic[tonic_index + 5] + ", " +
            flatted_two_octave_chromatic[tonic_index + 7] + ", " +
            flatted_two_octave_chromatic[tonic_index + 9] + ", " +
            flatted_two_octave_chromatic[tonic_index + 11]
          );
        }
      }
    }
    else if (p_root_note === "G") {
      // special G case
      for (let note of flatted_two_octave_chromatic) {
        if (p_root_note === note) {
          let tonic_index = flatted_two_octave_chromatic.indexOf(p_root_note);
          return (
            p_root_note + " melodic minor is: " +
            flatted_two_octave_chromatic[tonic_index] + ", " +
            flatted_two_octave_chromatic[tonic_index + 2] + ", " +
            flatted_two_octave_chromatic[tonic_index + 4] + "b, " +
            flatted_two_octave_chromatic[tonic_index + 5] + ", " +
            flatted_two_octave_chromatic[tonic_index + 7] + ", " +
            flatted_two_octave_chromatic[tonic_index + 9] + ", " +
            flatted_two_octave_chromatic[tonic_index + 10] + "#"
          );
        }
      }
    }
  }
  // Root with accidental
  else {
    // e.g. F#, C#, G#, D#, A# etc.
    if (p_root_note[1] === "#" && ["F#","C#"].includes(p_root_note)) {
      for (let note of sharped_two_octave_chromatic) {
        if (p_root_note === note) {
          let tonic_index = sharped_two_octave_chromatic.indexOf(p_root_note);
          return (
            p_root_note + " melodic minor is: " +
            sharped_two_octave_chromatic[tonic_index] + ", " +
            sharped_two_octave_chromatic[tonic_index + 2] + ", " +
            sharped_two_octave_chromatic[tonic_index + 3] + ", " +
            sharped_two_octave_chromatic[tonic_index + 5] + ", " +
            sharped_two_octave_chromatic[tonic_index + 7] + ", " +
            sharped_two_octave_chromatic[tonic_index + 8] + "#, " +
            sharped_two_octave_chromatic[tonic_index + 10] + "#"
          );
        }
      }
    }
    else if (p_root_note[1] === "#" && ["G#","D#","A#"].includes(p_root_note)) {
      for (let note of sharped_two_octave_chromatic) {
        if (p_root_note === note) {
          let tonic_index = sharped_two_octave_chromatic.indexOf(p_root_note);
          return (
            p_root_note + " melodic minor is: " +
            sharped_two_octave_chromatic[tonic_index] + ", " +
            sharped_two_octave_chromatic[tonic_index + 2] + ", " +
            sharped_two_octave_chromatic[tonic_index + 3] + ", " +
            sharped_two_octave_chromatic[tonic_index + 5] + ", " +
            sharped_two_octave_chromatic[tonic_index + 7] + ", " +
            sharped_two_octave_chromatic[tonic_index + 8] + "#, " +
            sharped_two_octave_chromatic[tonic_index + 9] + "##"
          );
        }
      }
    }
    else if (p_root_note[1] === "b") {
      for (let note of flatted_two_octave_chromatic) {
        if (p_root_note === note) {
          let tonic_index = flatted_two_octave_chromatic.indexOf(p_root_note);
          return (
            p_root_note + " melodic minor is: " +
            flatted_two_octave_chromatic[tonic_index] + ", " +
            flatted_two_octave_chromatic[tonic_index + 2] + ", " +
            flatted_two_octave_chromatic[tonic_index + 3] + ", " +
            flatted_two_octave_chromatic[tonic_index + 5] + ", " +
            flatted_two_octave_chromatic[tonic_index + 7] + ", " +
            flatted_two_octave_chromatic[tonic_index + 9] + ", " +
            flatted_two_octave_chromatic[tonic_index + 11]
          );
        }
      }
    }
  }
  return "Unable to find a melodic minor scale for " + p_root_note;
}

/*******************************************************************
 * 5) CHROMATIC SCALE
 *******************************************************************/
export function chromaticScale(p_root_note) {
  let isSharp = sharped_two_octave_chromatic.includes(p_root_note);
  let arr = isSharp ? sharped_two_octave_chromatic : flatted_two_octave_chromatic;

  let idx = arr.indexOf(p_root_note);
  if (idx < 0) {
    return "Unable to find a chromatic scale for " + p_root_note;
  }

  let notes = [];
  for (let i = 0; i < 12; i++) {
    notes.push(arr[idx + i]);
  }
  return p_root_note + " chromatic is: " + notes.join(", ");
}

/*******************************************************************
 * 6) MODES (Dorian, Phrygian, Lydian, Mixolydian)
 *******************************************************************/
export function dorianScale(root) {
  let isSharp = sharped_two_octave_chromatic.includes(root);
  let arr = isSharp ? sharped_two_octave_chromatic : flatted_two_octave_chromatic;

  let idx = arr.indexOf(root);
  if (idx < 0) return `Unable to find a Dorian scale for ${root}`;

  let intervals = [2,1,2,2,2,1,2];
  let notes = [arr[idx]];
  let current = idx;
  intervals.forEach(step => {
    current += step;
    notes.push(arr[current]);
  });
  return `${root} Dorian is: ${notes.join(", ")}`;
}

export function phrygianScale(root) {
  let isSharp = sharped_two_octave_chromatic.includes(root);
  let arr = isSharp ? sharped_two_octave_chromatic : flatted_two_octave_chromatic;

  let idx = arr.indexOf(root);
  if (idx < 0) return `Unable to find a Phrygian scale for ${root}`;

  let intervals = [1,2,2,2,1,2,2];
  let notes = [arr[idx]];
  let current = idx;
  intervals.forEach(step => {
    current += step;
    notes.push(arr[current]);
  });
  return `${root} Phrygian is: ${notes.join(", ")}`;
}

export function lydianScale(root) {
  let isSharp = sharped_two_octave_chromatic.includes(root);
  let arr = isSharp ? sharped_two_octave_chromatic : flatted_two_octave_chromatic;

  let idx = arr.indexOf(root);
  if (idx < 0) return `Unable to find a Lydian scale for ${root}`;

  let intervals = [2,2,2,1,2,2,1];
  let notes = [arr[idx]];
  let current = idx;
  intervals.forEach(step => {
    current += step;
    notes.push(arr[current]);
  });
  return `${root} Lydian is: ${notes.join(", ")}`;
}

export function mixolydianScale(root) {
  let isSharp = sharped_two_octave_chromatic.includes(root);
  let arr = isSharp ? sharped_two_octave_chromatic : flatted_two_octave_chromatic;

  let idx = arr.indexOf(root);
  if (idx < 0) return `Unable to find a Mixolydian scale for ${root}`;

  let intervals = [2,2,1,2,2,1,2];
  let notes = [arr[idx]];
  let current = idx;
  intervals.forEach(step => {
    current += step;
    notes.push(arr[current]);
  });
  return `${root} Mixolydian is: ${notes.join(", ")}`;
}
