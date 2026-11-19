const cop = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const day = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" });

export const money = (n: number) => cop.format(n);
export const date = (d: string | Date) => day.format(new Date(d));
