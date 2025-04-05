import React, { useState } from "react";

interface Props {
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

const Stepper: React.FC<Props> = ({ min = 1, max = 60, onChange }) => {
  const [value, setValue] = useState<number>(min);

  const clamp = (val: number) => Math.min(max, Math.max(min, val));

  const handleChange = (val: number) => {
    const clamped = clamp(val);
    setValue(clamped);
    onChange?.(clamped);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      handleChange(val);
    } else if (e.target.value === "") {
      setValue(NaN); // 빈 문자열 허용
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button onClick={() => handleChange(value - 1)} disabled={value <= min}>
        –
      </button>
      <input
        type="number"
        value={isNaN(value) ? "" : value}
        onChange={handleInputChange}
        onBlur={() => {
          // blur 시 NaN이면 최소값으로 복구
          if (isNaN(value)) handleChange(min);
        }}
        min={min}
        max={max}
        style={{
          width: "50px",
          textAlign: "center",
          padding: "4px",
        }}
      />
      <button onClick={() => handleChange(value + 1)} disabled={value >= max}>
        +
      </button>
    </div>
  );
};

export default Stepper;
