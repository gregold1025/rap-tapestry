// src/components/AudioEngine/ScrubSlider.jsx
export function ScrubSlider({ value, max, onChange }) {
  const handleChange = (e) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <input
      type="range"
      min="0"
      max={max}
      step="0.01"
      value={value}
      onChange={handleChange}
      style={{ width: "200px" }}
    />
  );
}
