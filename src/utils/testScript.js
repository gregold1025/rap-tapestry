import { parseMidiFile } from "./parseMidiFile.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolves to absolute path from testScript.js
const filePath = path.resolve(
  __dirname,
  "../assets/93Til/midi/jamBeatFullMidi.mid"
);

/**
 * Groups MIDI events by instrument key and logs the first N per group.
 * @param {string} midiFilePath - Path to your MIDI file
 * @param {number} n - Number of events to show per group
 */
async function printEventsByInstrument(midiFilePath, n = 10) {
  const { events } = await parseMidiFile(midiFilePath);

  // Group events by a composite instrument key: "channel:program"
  const grouped = {};

  for (const e of events) {
    const key = `channel:${e.channel}|program:${e.program ?? "null"}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  }

  // Print the first N events from each group
  for (const [instrumentKey, events] of Object.entries(grouped)) {
    console.log(`\n🎹 Instrument: ${instrumentKey}`);
    events.slice(0, n).forEach((e, i) => {
      console.log(
        `  ${i + 1}. ${e.type} | tick=${e.tick} | note=${
          e.midiNote
        } | velocity=${e.velocity}`
      );
    });
  }
}

// Example usage:
// const filePath = "../assets/93Til/midi/jamBeatFullMidi.mid";
printEventsByInstrument(filePath, 15);
