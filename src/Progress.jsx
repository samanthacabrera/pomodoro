export default function ProgressBar({ progress, running }) {
  const getTomatoColor = (progress) => {
    const stages = [
      { progress: 1, color: { r: 21, g: 128, b: 61 } },   // green-700
      { progress: 0.5, color: { r: 234, g: 88, b: 12 } }, // orange-600 
      { progress: 0, color: { r: 185, g: 28, b: 28 } },   // red-700 
    ];

    const interpolateColor = (c1, c2, factor) => {
      const r = Math.round(c1.r + (c2.r - c1.r) * factor);
      const g = Math.round(c1.g + (c2.g - c1.g) * factor);
      const b = Math.round(c1.b + (c2.b - c1.b) * factor);
      return `rgb(${r},${g},${b})`;
    };

    for (let i = 0; i < stages.length - 1; i++) {
      if (progress >= stages[i + 1].progress) {
        const factor =
          (progress - stages[i + 1].progress) / (stages[i].progress - stages[i + 1].progress);
        return interpolateColor(stages[i + 1].color, stages[i].color, factor);
      }
    }

    return `rgb(185,28,28)`; 
  };

  return (
    <div
      className="fixed bottom-0 left-0 transition-all duration-300"
      style={{
        width: `${(1 - progress) * 100}%`,
        backgroundColor: getTomatoColor(progress),
        height: running ? "20px" : "16px",
        transition: "width 1s linear, background-color 0.1s linear",
      }}
    />
  );
}
