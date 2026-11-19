const navigation = ["Dashboard", "Inventory", "Customers", "Sales", "Service", "Reports"];

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", color: "#17324d", fontFamily: "system-ui, sans-serif" }}>
      <aside style={{ position: "fixed", width: 220, height: "100vh", background: "#17324d", color: "white", padding: 24 }}>
        <h1 style={{ fontSize: 20 }}>Akshay DMS</h1>
        <nav style={{ display: "grid", gap: 10, marginTop: 32 }}>
          {navigation.map((item) => <a key={item} href={`#${item.toLowerCase()}`} style={{ color: "white", textDecoration: "none", padding: 8 }}>{item}</a>)}
        </nav>
      </aside>
      <section style={{ marginLeft: 220, padding: 32 }}>
        <header><h2>Dealership overview</h2><p>Live inventory and operations</p></header>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginTop: 24 }}>
          {[["Available vehicles", "—"], ["Today’s sales", "—"], ["Open service jobs", "—"], ["Customers", "—"]].map(([label, value]) => (
            <article key={label} style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 4px 16px #17324d12" }}>
              <div style={{ color: "#63788a", fontSize: 14 }}>{label}</div>
              <strong style={{ display: "block", fontSize: 30, marginTop: 8 }}>{value}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
