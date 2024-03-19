export const adjustOpacity = (color, percentage) => {
  try {
    const opacity = color[3] || 0;
    return [color[0], color[1], color[2], Math.round(opacity * percentage)];
  } catch (error) {
    console.error(`Unable to switch color: ${color} to opacity: ${percentage}`);
    return color;
  }
};
