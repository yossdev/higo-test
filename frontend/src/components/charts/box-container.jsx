export function BoxContainer({ children, title }) {
  return (
    <div className="border shadow-sm rounded">
      <h1 className="text-center font-semibold text-xl mt-5">{title}</h1>
      {children}
    </div>
  );
}
