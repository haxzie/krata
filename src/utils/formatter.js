export const areaFormatter = (value) => {
  if (!value) return null;

  if (value > 10000) {
    return (value / 1000000).toFixed(2) + " sq. km";
  } else {
    return value.toFixed(2) + " sq. m";
  }
};

export const distanceFormatter = (value) => {
  if (!value) return null;
  if (value < 1) {
    return (value * 1000).toFixed(2) + " m";
  } else {
    return value.toFixed(2) + " Km";
  }
};
