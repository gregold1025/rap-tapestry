export function computeBassRectangles({
  notes,
  timeToX,
  rowHeight,
  secondsPerRow,
}) {
  if (!notes.length) return [];

  // Determine pitch range
  const allNotes = notes.map((n) => n.midiNote);
  const minNote = Math.min(...allNotes);
  const maxNote = Math.max(...allNotes);
  const pitchRange = maxNote - minNote || 1; // avoid divide-by-zero

  return notes.map((note) => {
    // Time mapping
    const startSec = (note.startTick * (60 / 103)) / note.ticksPerBeat;
    const endSec = (note.endTick * (60 / 103)) / note.ticksPerBeat;
    const durationSec = endSec - startSec;

    const x = timeToX(startSec);
    const width = timeToX(endSec) - x;

    // Row mapping
    const row = Math.floor(startSec / secondsPerRow);
    const rowTop = row * rowHeight;

    // Normalize pitch to local Y within row
    const relativePitch = (note.midiNote - minNote) / pitchRange;
    const y =
      rowTop +
      (1 - relativePitch) * rowHeight * 0.9 +
      rowHeight * 0.025 +
      rowHeight * 0.5;

    return {
      x,
      y,
      width,
      height: rowHeight * 0.05, // thickness of note
      noteNumber: note.midiNote,
      velocity: note.velocity,
    };
  });
}
