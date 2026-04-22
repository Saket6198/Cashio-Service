export const toMonth = (value: any) => {
  const month = Number(value);
  return Number.isInteger(month) && month >= 1 && month <= 12
    ? month
    : new Date().getMonth() + 1;
};

export const toYear = (value: any) => {
  const year = Number(value);
  return Number.isInteger(year) ? year : new Date().getFullYear();
};
