import fs from "fs";
import pkg from "@tonejs/midi";
const { Midi } = pkg;

/**
 * Reads and parses a .mid file into structured MIDI note events.
 * @param {string} midiPath - Path to the .mid file
 * @returns {Promise<object>} - Parsed event list and metadata
 */
export async function parseMidiFile(midiPath) {
  const buffer = fs.readFileSync(midiPath);
  const midi = new Midi(buffer);

  const ticksPerBeat = midi.header.ppq;
  const bpm = midi.header.tempos?.[0]?.bpm ?? 120;

  const events = [];

  for (const track of midi.tracks) {
    const program = track.instrument.number ?? null;
    const channel = track.channel;

    for (const note of track.notes) {
      events.push({
        type: "noteOn",
        tick: note.ticks,
        midiNote: note.midi,
        velocity: note.velocity,
        channel,
        program,
      });

      events.push({
        type: "noteOff",
        tick: note.ticks + note.durationTicks,
        midiNote: note.midi,
        velocity: 0,
        channel,
        program,
      });
    }
  }

  events.sort((a, b) => a.tick - b.tick);

  const totalTicks = Math.max(...events.map((e) => e.tick));

  return {
    events,
    ticksPerBeat,
    bpm,
    totalTicks,
  };
}
