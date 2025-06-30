import { Midi } from "@tonejs/midi";

/**
 * Parse a MIDI file *in the browser* using fetch.
 * @param {string} midiUrl - Public URL to your MIDI file
 * @returns {Promise<{ notes: object[], ticksPerBeat: number, bpm: number }>}
 */
export async function parseMidiFile(midiUrl) {
  // Load it as arrayBuffer using fetch
  const response = await fetch(midiUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch MIDI file: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();

  // Parse with @tonejs/midi
  const midi = new Midi(arrayBuffer);

  const ticksPerBeat = midi.header.ppq;
  const bpm = midi.header.tempos?.[0]?.bpm ?? 103; // fallback to your hard-coded BPM

  // Extract notes
  const notes = [];
  for (const track of midi.tracks) {
    for (const note of track.notes) {
      notes.push({
        midiNote: note.midi,
        startTick: note.ticks,
        endTick: note.ticks + note.durationTicks,
        velocity: note.velocity,
        durationTicks: note.durationTicks,
        startSeconds: note.time,
        durationSeconds: note.duration,
      });
    }
  }

  return {
    notes,
    ticksPerBeat,
    bpm,
  };
}
