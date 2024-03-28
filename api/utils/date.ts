export const todayDate = new Date().toLocaleDateString("es-AR", {
  timeZone: "America/Argentina/Buenos_Aires",
});

export const formattedDate = (dateString: string) => {
  const [day, month, year] = dateString.split("/");
  const formattedMonth = month.length === 1 ? "0" + month : month;
  const formattedDay = day.length === 1 ? "0" + day : day;
  return `${year}-${formattedMonth}-${formattedDay}`;
};
