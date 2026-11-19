"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

type Vehicle = { id: string; chassis_number: string; brand: string; model: string; variant: string; year: number; color: string | null; selling_price: number; status: string };
type Customer = { id: string; name: string; phone: string; email: string | null; created_at: string };
type Sale = { id: string; amount: number; status: string; created_at: string };
type ServiceJob = { id: string; description: string; status: string; cost: number };
type Section = "Overview" | "Inventory" | "Customers" | "Sales" | "Service";
const sections: Section[] = ["Overview", "Inventory", "Customers", "Sales", "Service"];

export default function Home() {
  const [section, setSection] = useState<Section>("Overview");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [jobs, setJobs] = useState<ServiceJob[]>([]);
  const [notice, setNotice] = useState("");
  const supabase = createClient();

  const refresh = useCallback(async () => {
    const [v, c, s, j] = await Promise.all([
      supabase.from("vehicles").select("id,chassis_number,brand,model,variant,year,color,selling_price,status").order("created_at", { ascending: false }),
      supabase.from("customers").select("id,name,phone,email,created_at").order("created_at", { ascending: false }),
      supabase.from("sales").select("id,amount,status,created_at").order("created_at", { ascending: false }),
      supabase.from("service_jobs").select("id,description,status,cost").order("created_at", { ascending: false })
    ]);
    const failure = v.error || c.error || s.error || j.error;
    if (failure) setNotice(failure.message);
    else {
      setVehicles(v.data ?? []); setCustomers(c.data ?? []); setSales(s.data ?? []); setJobs(j.data ?? []);
      setNotice("");
    }
  }, [supabase]);

  useEffect(() => {
    void refresh();
    const channel = supabase.channel("dealership-live-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "vehicles" }, () => void refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "customers" }, () => void refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "sales" }, () => void refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "service_jobs" }, () => void refresh())
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [refresh, supabase]);

  async function signOut() { await supabase.auth.signOut(); window.location.assign("/login"); }

  async function addCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { error } = await supabase.from("customers").insert({ name: String(form.get("name")).trim(), phone: String(form.get("phone")).trim(), email: String(form.get("email") || "").trim() || null });
    setNotice(error ? error.message : "Customer added successfully");
    if (!error) event.currentTarget.reset();
  }

  async function addVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { error } = await supabase.from("vehicles").insert({ chassis_number: String(form.get("chassis_number")).trim(), brand: String(form.get("brand")).trim(), model: String(form.get("model")).trim(), variant: String(form.get("variant")).trim(), year: Number(form.get("year")), color: String(form.get("color") || "").trim() || null, cost_price: Number(form.get("cost_price")), selling_price: Number(form.get("selling_price")) });
    setNotice(error ? error.message : "Vehicle added to inventory");
    if (!error) event.currentTarget.reset();
  }

  return <main className="app-shell">
    <aside className="sidebar"><a className="logo" href="#overview"><span className="brand-mark small-mark">A</span><span>Akshay <b>DMS</b></span></a>
      <p className="eyebrow nav-label">WORKSPACE</p><nav>{sections.map((item) => <button key={item} className={section === item ? "nav-item active" : "nav-item"} onClick={() => setSection(item)}><span className="nav-dot" />{item}</button>)}</nav>
      <div className="sidebar-bottom"><span className="online-dot" /> Connected workspace</div>
    </aside>
    <section className="main-panel"><header className="topbar"><div><p className="eyebrow">DEALERSHIP MANAGEMENT</p><h1>{section}</h1></div><button className="signout" onClick={signOut}>Sign out</button></header>
      {notice && <div className={notice.includes("successfully") || notice.includes("added to") ? "notice success" : "notice"}>{notice}<button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}
      {section === "Overview" && <><div className="welcome"><div><p className="eyebrow light">YOUR BUSINESS AT A GLANCE</p><h2>Good work starts with a clear view.</h2><p>Inventory, customers, and after-sales service in one place.</p></div><div className="welcome-icon">↗</div></div><div className="stat-grid"><Stat label="Available vehicles" value={vehicles.filter(v => v.status === "available").length} detail="In stock" icon="◈"/><Stat label="Customers" value={customers.length} detail="Customer records" icon="◎"/><Stat label="Sales" value={sales.length} detail="Recorded sales" icon="↗"/><Stat label="Open service jobs" value={jobs.filter(j => j.status !== "completed" && j.status !== "cancelled").length} detail="Active work" icon="⌁"/></div><div className="content-card"><div className="card-heading"><div><h3>Recent inventory</h3><p>Latest vehicles added to stock</p></div><button className="text-button" onClick={() => setSection("Inventory")}>View inventory →</button></div><VehicleTable rows={vehicles.slice(0, 5)}/></div></>}
      {section === "Inventory" && <div className="two-column"><div className="content-card"><div className="card-heading"><div><h3>Vehicle inventory</h3><p>{vehicles.length} vehicles on record</p></div></div><VehicleTable rows={vehicles}/></div><form className="content-card form-card" onSubmit={addVehicle}><h3>Add vehicle</h3><p className="muted">Record a new unit in stock.</p><label>Chassis number<input name="chassis_number" required /></label><div className="form-row"><label>Brand<input name="brand" required /></label><label>Model<input name="model" required /></label></div><div className="form-row"><label>Variant<input name="variant" required /></label><label>Year<input name="year" type="number" min="1900" max="2200" required /></label></div><label>Color<input name="color" /></label><div className="form-row"><label>Cost price<input name="cost_price" type="number" min="0" step="0.01" required /></label><label>Selling price<input name="selling_price" type="number" min="0" step="0.01" required /></label></div><button className="primary">Save vehicle</button></form></div>}
      {section === "Customers" && <div className="two-column"><div className="content-card"><div className="card-heading"><div><h3>Customers</h3><p>{customers.length} customer records</p></div></div><CustomerTable rows={customers}/></div><form className="content-card form-card" onSubmit={addCustomer}><h3>Add customer</h3><p className="muted">Keep contact details ready for sales and service.</p><label>Full name<input name="name" required /></label><label>Phone<input name="phone" type="tel" pattern="\\+?[0-9]{7,15}" required /></label><label>Email <span className="muted">(optional)</span><input name="email" type="email" /></label><button className="primary">Save customer</button></form></div>}
      {section === "Sales" && <div className="content-card"><div className="card-heading"><div><h3>Sales</h3><p>Latest recorded transactions</p></div></div><SimpleTable headers={["Sale", "Amount", "Status", "Created"]} rows={sales.map(x => [x.id.slice(0, 8), money(x.amount), x.status, new Date(x.created_at).toLocaleDateString()])}/></div>}
      {section === "Service" && <div className="content-card"><div className="card-heading"><div><h3>Service jobs</h3><p>Workshop work in progress</p></div></div><SimpleTable headers={["Job", "Description", "Status", "Cost"]} rows={jobs.map(x => [x.id.slice(0, 8), x.description, x.status, money(x.cost)])}/></div>}
      <footer>Akshay DMS <span>•</span> Live updates enabled</footer>
    </section>
  </main>;
}

function Stat({ label, value, detail, icon }: { label: string; value: number; detail: string; icon: string }) { return <article className="stat-card"><span className="stat-icon">{icon}</span><p>{label}</p><strong>{value}</strong><small>{detail}</small></article>; }
function VehicleTable({ rows }: { rows: Vehicle[] }) { return <SimpleTable headers={["Vehicle", "Chassis", "Year", "Price", "Status"]} rows={rows.map(v => [`${v.brand} ${v.model} · ${v.variant}`, v.chassis_number, String(v.year), money(v.selling_price), v.status])}/>; }
function CustomerTable({ rows }: { rows: Customer[] }) { return <SimpleTable headers={["Name", "Phone", "Email", "Added"]} rows={rows.map(c => [c.name, c.phone, c.email || "—", new Date(c.created_at).toLocaleDateString()])}/>; }
function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) { return <div className="table-scroll"><table><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{j === row.length - 1 && ["available", "reserved", "sold", "draft", "confirmed", "delivered", "cancelled", "scheduled", "in_progress", "completed"].includes(cell) ? <span className={`badge ${cell}`}>{cell.replace("_", " ")}</span> : cell}</td>)}</tr>) : <tr><td className="empty" colSpan={headers.length}>No records yet</td></tr>}</tbody></table></div>; }
function money(value: number) { return new Intl.NumberFormat(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0); }
