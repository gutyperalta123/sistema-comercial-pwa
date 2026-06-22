export default function StatCard({ color, titulo, valor }) {
  return (
    <div className={`stat-card border-${color}`}>
      <span>{titulo}</span>
      <h3>{valor}</h3>
    </div>
  );
}