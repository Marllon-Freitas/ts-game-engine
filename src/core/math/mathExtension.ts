/* eslint-disable @typescript-eslint/no-explicit-any */
interface Math {
  clamp(value: number, min: number, max: number): number;
  degToRad(degrees: number): number;
  radToDeg(radians: number): number;
}

(Math as any).clamp = function (value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

(Math as any).degToRad = function (degrees: number): number {
  return (degrees * Math.PI) / 180;
};

(Math as any).radToDeg = function (radians: number): number {
  return (radians * 180) / Math.PI;
};
