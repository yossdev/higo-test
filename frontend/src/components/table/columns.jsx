export const columns = [
  "CustomerID",
  "Gender",
  "Age",
  "Spending Score",
  "Profession",
  "Work Experience",
  "Family Size",
  "Annual Income",
].map((v) => {
  const c = {
    accessorKey: (() => {
      const split = v.split(" ");
      if (split.length > 1) {
        return split.join("");
      }
      return v;
    })(),
    header: () =>
      v === "Annual Income" ? <div className="text-right">{v}</div> : v,
  };
  if (v === "Annual Income") {
    return {
      ...c,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("AnnualIncome"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    };
  }
  return c;
});
