export const isToday = (date) => {
  const today = new Date();
  const target = new Date(date);
  return (
    today.getDate() === target.getDate() &&
    today.getMonth() === target.getMonth() &&
    today.getFullYear() === target.getFullYear()
  );
};
