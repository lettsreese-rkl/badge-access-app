import React, { useMemo, useState } from "react";

type Item = { id: string; label: string; category: string; curriculum: string; approver: string; decision: string };
type AuditEntry = { timestamp: string; action: string; actor: string; note: string };
type RequestRecord = {
  id: string; requester: string; requestedFor: string; typeOfChange: string; reason: string; urgency: string;
  status: string; stage: string; submitted: string; due: string; generalSite: boolean; ert: boolean;
  removeAll: boolean; items: Item[]; audit: AuditEntry[];
};
type KeyRequest = {
  id: string; keyAreaId: string; keyAreaName: string; keyNumber: string; owner: string;
  facilities: string; startDate: string; expirationDate: string;
};

const restrictedAreas = [
  { id: "general-site", areaName: "General Site Access", category: "General Site", curriculum: "AGT-CUR-SFD-All / SFD TC Core", defaultOwner: "Michelle Howington" },
  { id: "gmp-warehouse", areaName: "GMP Warehouse", category: "Restricted Area", curriculum: "AGT-CUR-SFD-ACCESS-WH1", defaultOwner: "Chip Morgan" },
  { id: "gmp-warehouse-sampling", areaName: "GMP Warehouse Raw Materials Sampling", category: "Restricted Area", curriculum: "AGT-CUR-SFD-ACCESS-WH2", defaultOwner: "Chip Morgan" },
  { id: "gmp-warehouse-freezers", areaName: "GMP Warehouse Freezers", category: "Restricted Area", curriculum: "AGT-CUR-SFD-ACCESS-WH3", defaultOwner: "Chip Morgan" },
  { id: "it-server", areaName: "Information Technology Data and Server Rooms", category: "Restricted Area", curriculum: "AGT-CUR-SFD-ACCESS-IT", defaultOwner: "Matthew Young" },
  { id: "manufacturing-cs2", areaName: "Manufacturing / CS-2", category: "Restricted Area", curriculum: "AGT-CUR-SFD-ACCESS-CS2", defaultOwner: "Jake Bullard / Laura Schott / Alex Andrew" },
  { id: "qc-micro", areaName: "QC Labs - Micro", category: "Restricted Area", curriculum: "QC Micro curriculum", defaultOwner: "Leslie Falco" },
  { id: "qc-biochemical", areaName: "QC Labs - Biochemical", category: "Restricted Area", curriculum: "QC Biochemical curriculum", defaultOwner: "Ryan Schuchman" },
  { id: "qc-analytical", areaName: "QC Labs - Analytical", category: "Restricted Area", curriculum: "QC Analytical curriculum", defaultOwner: "Phillip Kidd" },
  { id: "qc-systems", areaName: "QC Systems", category: "Restricted Area", curriculum: "QC Systems curriculum", defaultOwner: "Heather Greiner" },
  { id: "facilities-maintenance", areaName: "Facilities Maintenance", category: "Restricted Area", curriculum: "Facilities Maintenance curriculum", defaultOwner: "David Brainard" },
  { id: "biohazardous-waste-dock", areaName: "Biohazardous Waste Dock", category: "Restricted Area", curriculum: "Waste Dock curriculum", defaultOwner: "Pahola Salas" },
  { id: "document-control-archive", areaName: "Document Control Archive", category: "Restricted Area", curriculum: "Document Control Archive curriculum", defaultOwner: "Ann Davis" },
];

const keyAreas = [
  { id: "key-qc-stability", name: "QC Controlled Stability Chamber Key", owner: "QC Operations", facilities: "David Brainard" },
  { id: "key-padlock-cage", name: "Padlocked Cage Key", owner: "Area Owner", facilities: "David Brainard" },
  { id: "key-equipment", name: "Equipment Key", owner: "Area Owner", facilities: "David Brainard" },
  { id: "key-general", name: "Other Controlled Key", owner: "Area Owner", facilities: "David Brainard" },
];

const trainingPool = ["Chelsea Senter", "Justin Harmon", "Melodie Albertson"];
const ehsApprover = "EHS Reviewer";
const securityAdmin = "Michelle Howington";

const starterRequests: RequestRecord[] = [
  {
    id: "ACF-000123", requester: "Reese Letts", requestedFor: "Jordan Miller", typeOfChange: "Add Access",
    reason: "New Hire", urgency: "Normal", status: "In Approval", stage: "Area Owner Review",
    submitted: "2026-03-09", due: "2026-03-13", generalSite: true, ert: false, removeAll: false,
    items: [
      { id: "item-1", label: "GMP Warehouse", category: "Restricted Area", curriculum: "AGT-CUR-SFD-ACCESS-WH1", approver: "Chip Morgan", decision: "Pending" },
      { id: "item-2", label: "Manufacturing / CS-2", category: "Restricted Area", curriculum: "AGT-CUR-SFD-ACCESS-CS2", approver: "Jake Bullard", decision: "Pending" },
    ],
    audit: [
      { timestamp: "2026-03-09 09:02", action: "Submitted", actor: "Reese Letts", note: "New request created." },
      { timestamp: "2026-03-09 09:15", action: "Approved", actor: "Line Manager", note: "Need confirmed and LMS verified." },
      { timestamp: "2026-03-09 09:27", action: "Approved", actor: "Chelsea Senter", note: "Training review completed." },
    ],
  },
  {
    id: "ACF-000124", requester: "Reese Letts", requestedFor: "Taylor Nash", typeOfChange: "Termination",
    reason: "Termination", urgency: "High", status: "Completed", stage: "Completed", submitted: "2026-03-05",
    due: "2026-03-05", generalSite: false, ert: false, removeAll: true,
    items: [{ id: "item-3", label: "Remove all badge access", category: "Removal", curriculum: "N/A", approver: securityAdmin, decision: "Completed" }],
    audit: [
      { timestamp: "2026-03-05 08:14", action: "Submitted", actor: "Line Manager", note: "Termination access removal submitted." },
      { timestamp: "2026-03-05 08:25", action: "Completed", actor: securityAdmin, note: "Badge access ended in security system." },
    ],
  },
  {
    id: "ACF-000125", requester: "Avery Smith", requestedFor: "Avery Smith", typeOfChange: "Add Access",
    reason: "Change of Job Function/Assignment", urgency: "Normal", status: "Partially Approved",
    stage: "Security Finalization", submitted: "2026-03-07", due: "2026-03-11", generalSite: false,
    ert: false, removeAll: false,
    items: [
      { id: "item-4", label: "IT Data and Server Rooms", category: "Restricted Area", curriculum: "AGT-CUR-SFD-ACCESS-IT", approver: "Matthew Young", decision: "Approved" },
      { id: "item-5", label: "Document Control Archive", category: "Restricted Area", curriculum: "Document Control Archive curriculum", approver: "Ann Davis", decision: "Rejected" },
    ],
    audit: [
      { timestamp: "2026-03-07 10:01", action: "Submitted", actor: "Avery Smith", note: "Request created." },
      { timestamp: "2026-03-07 10:22", action: "Approved", actor: "Line Manager", note: "LMS confirmed." },
      { timestamp: "2026-03-07 11:03", action: "Approved", actor: "Justin Harmon", note: "Training review complete." },
      { timestamp: "2026-03-07 12:11", action: "Approved", actor: "Matthew Young", note: "Business need confirmed." },
      { timestamp: "2026-03-07 13:44", action: "Rejected", actor: "Ann Davis", note: "No current archive access need." },
    ],
  },
];

const emptyForm = {
  submitFor: "self", requestedFor: "", requester: "Reese Letts", employeeId: "", department: "",
  employeeType: "Employee", companyAffiliation: "Astellas Pharma", lineManager: "", lineManagerOverride: "",
  typeOfChange: "Add Access", reason: "New Hire", urgency: "Normal", comments: "", accessGeneralSite: false,
  accessRestricted: false, accessERT: false, accessKey: false, removeAll: false,
  selectedAreas: [] as string[], keyRequests: [] as KeyRequest[],
};

function statusTone(status: string) {
  if (status === "Completed" || status === "Approved") return "success";
  if (status === "In Approval" || status === "Security Finalization") return "info";
  if (status === "Partially Approved") return "warn";
  if (status === "Rejected") return "danger";
  return "neutral";
}

function buildApproverPreview(form: typeof emptyForm) {
  const preview: string[] = [];
  if (form.accessRestricted && !form.removeAll) {
    preview.push("Line Manager → verifies business need and LMS completion");
    preview.push(`${trainingPool[0]} (or training pool) → training review`);
    form.selectedAreas.forEach((id) => {
      const area = restrictedAreas.find((x) => x.id === id);
      if (area) preview.push(`${area.defaultOwner} → ${area.areaName}`);
    });
  }
  if (form.accessERT && !form.removeAll) {
    preview.push("Line Manager → verifies business need and LMS completion");
    preview.push(`${trainingPool[0]} (or training pool) → training review`);
    preview.push(`${ehsApprover} → ERT approval`);
  }
  if (form.accessKey && !form.removeAll) {
    form.keyRequests.forEach((key) => {
      preview.push(`${key.owner || "Area Owner"} → ${key.keyAreaName || "Key Area"}`);
      preview.push(`${key.facilities || "David Brainard"} → Facilities`);
    });
  }
  preview.push(`${securityAdmin} → final completion in security system`);
  return preview;
}

export default function App() {
  const [requests, setRequests] = useState<RequestRecord[]>(starterRequests);
  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedRequest, setSelectedRequest] = useState<RequestRecord>(starterRequests[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [approvalComment, setApprovalComment] = useState("");
  const [showAudit, setShowAudit] = useState(false);

  const metrics = useMemo(() => {
    const open = requests.filter((r) => ["In Approval", "Partially Approved"].includes(r.status)).length;
    const completed = requests.filter((r) => r.status === "Completed").length;
    const partial = requests.filter((r) => r.status === "Partially Approved").length;
    const rejected = requests.flatMap((r) => r.items).filter((i) => i.decision === "Rejected").length;
    return { open, completed, partial, rejected };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = request.id.toLowerCase().includes(q) || request.requestedFor.toLowerCase().includes(q) || request.requester.toLowerCase().includes(q) || request.stage.toLowerCase().includes(q);
      const matchesFilter = filterStatus === "All" || request.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [requests, searchTerm, filterStatus]);

  const selectedAreaObjects = restrictedAreas.filter((area) => form.selectedAreas.includes(area.id));
  const approverPreview = buildApproverPreview(form);

  const progressValue = useMemo(() => {
    let score = 20;
    if (form.employeeId && form.department) score += 20;
    if (form.accessGeneralSite || form.accessRestricted || form.accessERT || form.accessKey || form.removeAll) score += 20;
    if (form.selectedAreas.length > 0 || form.keyRequests.length > 0 || form.removeAll || form.accessGeneralSite) score += 20;
    if (form.lineManager || form.lineManagerOverride) score += 20;
    return Math.min(score, 100);
  }, [form]);

  function updateField(field: string, value: any) { setForm((prev) => ({ ...prev, [field]: value })); }
  function toggleArea(areaId: string) {
    setForm((prev) => {
      const exists = prev.selectedAreas.includes(areaId);
      return { ...prev, selectedAreas: exists ? prev.selectedAreas.filter((id) => id !== areaId) : [...prev.selectedAreas, areaId] };
    });
  }
  function addKeyRequest() {
    setForm((prev) => ({
      ...prev,
      keyRequests: [...prev.keyRequests, { id: `key-${Date.now()}`, keyAreaId: "", keyAreaName: "", keyNumber: "", owner: "", facilities: "David Brainard", startDate: "", expirationDate: "" }],
    }));
  }
  function updateKeyRequest(id: string, field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      keyRequests: prev.keyRequests.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, [field]: value };
        if (field === "keyAreaId") {
          const master = keyAreas.find((x) => x.id === value);
          if (master) { next.keyAreaName = master.name; next.owner = master.owner; next.facilities = master.facilities; }
        }
        return next;
      }),
    }));
  }
  function removeKeyRequest(id: string) { setForm((prev) => ({ ...prev, keyRequests: prev.keyRequests.filter((item) => item.id !== id) })); }
  function createRequest() {
    const id = `ACF-${String(requests.length + 126).padStart(6, "0")}`;
    const items: Item[] = [
      ...(form.accessGeneralSite ? [{ id: `item-general-${Date.now()}`, label: "General Site Access", category: "General Site", curriculum: "AGT-CUR-SFD-All / SFD TC Core", approver: securityAdmin, decision: "Pending" }] : []),
      ...selectedAreaObjects.map((area) => ({ id: `item-${area.id}`, label: area.areaName, category: form.accessERT ? "Emergency Response Team" : area.category, curriculum: area.curriculum, approver: form.accessERT ? ehsApprover : area.defaultOwner, decision: "Pending" })),
      ...form.keyRequests.map((key) => ({ id: key.id, label: key.keyAreaName || "Controlled Key Request", category: "Controlled Key", curriculum: "N/A", approver: key.owner || "Area Owner", decision: "Pending" })),
      ...(form.removeAll ? [{ id: `item-remove-all-${Date.now()}`, label: "Remove all access", category: "Removal", curriculum: "N/A", approver: securityAdmin, decision: "Pending" }] : []),
    ];
    const newRequest: RequestRecord = {
      id, requester: form.requester, requestedFor: form.submitFor === "self" ? form.requester : form.requestedFor || "Requested Person",
      typeOfChange: form.typeOfChange, reason: form.reason, urgency: form.urgency, status: "In Approval",
      stage: form.removeAll ? "Security Review" : "Line Manager Review",
      submitted: new Date().toISOString().slice(0, 10),
      due: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      generalSite: form.accessGeneralSite, ert: form.accessERT, removeAll: form.removeAll, items,
      audit: [{ timestamp: new Date().toLocaleString(), action: "Submitted", actor: form.requester, note: "Request created in Badge Access Management App." }],
    };
    setRequests((prev) => [newRequest, ...prev]);
    setSelectedRequest(newRequest);
    setForm(emptyForm);
    setActiveTab("requests");
  }
  function actOnRequest(decision: "Approved" | "Rejected") {
    const note = approvalComment || (decision === "Approved" ? "Approved in prototype workflow." : "Rejected in prototype workflow.");
    const updated = { ...selectedRequest, status: decision === "Approved" ? "In Approval" : "Rejected", stage: decision === "Approved" ? "Next Workflow Step" : "Rejected", audit: [{ timestamp: new Date().toLocaleString(), action: decision, actor: "Current Approver", note }, ...selectedRequest.audit] };
    setSelectedRequest(updated); setRequests((prev) => prev.map((req) => (req.id === updated.id ? updated : req))); setApprovalComment("");
  }
  function sendBackRequest() {
    const updated = { ...selectedRequest, status: "In Approval", stage: "Sent Back for Update", audit: [{ timestamp: new Date().toLocaleString(), action: "Sent Back", actor: "Current Approver", note: approvalComment || "Returned for update." }, ...selectedRequest.audit] };
    setSelectedRequest(updated); setRequests((prev) => prev.map((req) => (req.id === updated.id ? updated : req))); setApprovalComment("");
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <div className="eyebrow">Sanford Access Control Workflow</div>
          <h1>Badge Access Management App</h1>
          <p className="hero-copy">Prototype for replacing the current site access request process with one application for general site access, restricted areas, ERT, controlled key access, removals, approvals, audit trail, and security completion.</p>
        </div>
        <div className="metric-grid">
          <MetricCard label="Open" value={metrics.open} />
          <MetricCard label="Completed" value={metrics.completed} />
          <MetricCard label="Partial" value={metrics.partial} />
          <MetricCard label="Denied Items" value={metrics.rejected} />
        </div>
      </header>

      <nav className="tabbar">
        {["home", "new", "requests", "approvals", "admin"].map((tab) => (
          <button key={tab} className={`tab ${activeTab === tab ? "tab-active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab === "new" ? "New Request" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {activeTab === "home" && (
        <section className="two-col home-grid">
          <div className="card">
            <div className="card-title">Workflow overview</div>
            <div className="step-list">
              {["Requester submits for self or another person","Line manager verifies business need and LMS completion","Training review routes to training pool","Area owner / EHS / Facilities run in parallel where needed","Security System Administrator completes implementation","Final PDF, audit trail, and dashboard status are retained"].map((step, i) => (
                <div className="step-item" key={step}><div className="step-num">{i + 1}</div><div>{step}</div></div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-title">Quick actions</div>
            <div className="stack">
              <button className="primary-btn" onClick={() => setActiveTab("new")}>Start new request</button>
              <button className="secondary-btn" onClick={() => setActiveTab("requests")}>View request dashboard</button>
              <button className="secondary-btn" onClick={() => setActiveTab("approvals")}>Review approvals inbox</button>
            </div>
          </div>
        </section>
      )}

      {activeTab === "new" && (
        <section className="two-col">
          <div className="card">
            <div className="card-title">New access request</div>
            <div className="progress-wrap">
              <div className="progress-row"><span>Completion progress</span><span>{progressValue}%</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressValue}%` }} /></div>
            </div>
            <SectionTitle title="1. Personnel information" subtitle="Submit for yourself or another employee/contractor." />
            <div className="form-grid">
              <Field label="Submit for"><select value={form.submitFor} onChange={(e) => updateField("submitFor", e.target.value)}><option value="self">Myself</option><option value="other">Another person</option></select></Field>
              <Field label="Requested person name"><input value={form.submitFor === "self" ? form.requester : form.requestedFor} onChange={(e) => updateField("requestedFor", e.target.value)} disabled={form.submitFor === "self"} /></Field>
              <Field label="Employee ID (A#)"><input value={form.employeeId} onChange={(e) => updateField("employeeId", e.target.value)} /></Field>
              <Field label="Department"><input value={form.department} onChange={(e) => updateField("department", e.target.value)} /></Field>
              <Field label="Employee type"><select value={form.employeeType} onChange={(e) => updateField("employeeType", e.target.value)}><option>Employee</option><option>Contractor</option><option>Consultant</option><option>Other</option></select></Field>
              <Field label="Company affiliation"><input value={form.companyAffiliation} onChange={(e) => updateField("companyAffiliation", e.target.value)} /></Field>
              <Field label="Line manager"><input value={form.lineManager} onChange={(e) => updateField("lineManager", e.target.value)} placeholder="Auto-populated or manually selected" /></Field>
              <Field label="Line manager override"><input value={form.lineManagerOverride} onChange={(e) => updateField("lineManagerOverride", e.target.value)} placeholder="Optional override" /></Field>
            </div>

            <hr className="divider" />
            <SectionTitle title="2. Request type" subtitle="Select the change type and relevant access categories." />
            <div className="form-grid three">
              <Field label="Type of change"><select value={form.typeOfChange} onChange={(e) => updateField("typeOfChange", e.target.value)}><option>Add Access</option><option>Revoke Access</option></select></Field>
              <Field label="Reason for change"><select value={form.reason} onChange={(e) => updateField("reason", e.target.value)}><option>New Hire</option><option>Change of Job Function/Assignment</option><option>Termination</option><option>Other</option></select></Field>
              <Field label="Urgency"><select value={form.urgency} onChange={(e) => updateField("urgency", e.target.value)}><option>Low</option><option>Normal</option><option>High</option></select></Field>
            </div>

            <div className="pill-grid">
              {[["accessGeneralSite","General Site Access"],["accessRestricted","Restricted Area Access"],["accessERT","Emergency Response Team"],["accessKey","Controlled Key Access"],["removeAll","Remove All Access"]].map(([field, label]) => (
                <label className="pill-check" key={field}><input type="checkbox" checked={Boolean((form as any)[field])} onChange={(e) => updateField(field, e.target.checked)} /><span>{label}</span></label>
              ))}
            </div>

            <Field label="Comments"><textarea rows={4} value={form.comments} onChange={(e) => updateField("comments", e.target.value)} placeholder="Optional business justification, urgency context, or additional notes." /></Field>

            {(form.accessRestricted || form.accessERT) && !form.removeAll && (
              <>
                <hr className="divider" />
                <SectionTitle title="3. Restricted area selection" subtitle="Choose one or more predefined access areas. Curriculum displays automatically." />
                <div className="stack">
                  {restrictedAreas.filter((a) => a.id !== "general-site").map((area) => {
                    const checked = form.selectedAreas.includes(area.id);
                    return <label key={area.id} className={`select-card ${checked ? "select-card-active" : ""}`}>
                      <div className="select-card-main">
                        <input type="checkbox" checked={checked} onChange={() => toggleArea(area.id)} />
                        <div><div className="select-title">{area.areaName}</div><div className="muted">Curriculum: {area.curriculum}</div><div className="muted">Default approver: {form.accessERT ? ehsApprover : area.defaultOwner}</div></div>
                      </div>
                      <span className="chip">{form.accessERT ? "ERT Route" : area.category}</span>
                    </label>;
                  })}
                </div>
              </>
            )}

            {form.accessKey && !form.removeAll && (
              <>
                <hr className="divider" />
                <div className="section-head-row">
                  <SectionTitle title="4. Key access selection" subtitle="Add one or more controlled key requests." />
                  <button className="secondary-btn" onClick={addKeyRequest}>Add key request</button>
                </div>
                {form.keyRequests.length === 0 && <div className="empty-box">No key requests added yet.</div>}
                <div className="stack">
                  {form.keyRequests.map((key) => (
                    <div className="subcard" key={key.id}>
                      <div className="form-grid three">
                        <Field label="Key area"><select value={key.keyAreaId} onChange={(e) => updateKeyRequest(key.id, "keyAreaId", e.target.value)}><option value="">Choose key area</option>{keyAreas.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select></Field>
                        <Field label="Key number"><input value={key.keyNumber} onChange={(e) => updateKeyRequest(key.id, "keyNumber", e.target.value)} /></Field>
                        <Field label="Area owner / key owner"><input value={key.owner} onChange={(e) => updateKeyRequest(key.id, "owner", e.target.value)} /></Field>
                        <Field label="Facilities approver"><input value={key.facilities} onChange={(e) => updateKeyRequest(key.id, "facilities", e.target.value)} /></Field>
                        <Field label="Start date"><input type="date" value={key.startDate} onChange={(e) => updateKeyRequest(key.id, "startDate", e.target.value)} /></Field>
                        <Field label="Expiration date"><input type="date" value={key.expirationDate} onChange={(e) => updateKeyRequest(key.id, "expirationDate", e.target.value)} /></Field>
                      </div>
                      <button className="link-btn danger-text" onClick={() => removeKeyRequest(key.id)}>Remove key request</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <hr className="divider" />
            <div className="footer-actions">
              <div className="muted">This prototype supports partial approval, send-back, and final security completion.</div>
              <button className="primary-btn" onClick={createRequest}>Submit request</button>
            </div>
          </div>

          <div className="stack">
            <div className="card"><div className="card-title">Approver preview</div><div className="stack">{approverPreview.length === 0 ? <div className="muted">Select request types and areas to preview the routing path.</div> : approverPreview.map((entry) => <div key={entry} className="soft-box">{entry}</div>)}</div></div>
            <div className="card"><div className="card-title">Selected area curricula</div><div className="stack">{selectedAreaObjects.length === 0 ? <div className="muted">No restricted areas selected yet.</div> : selectedAreaObjects.map((area) => <div key={area.id} className="subcard tight"><div className="select-title">{area.areaName}</div><div className="muted">{area.curriculum}</div></div>)}</div></div>
          </div>
        </section>
      )}

      {activeTab === "requests" && (
        <section className="card">
          <div className="card-title">Request dashboard</div>
          <div className="toolbar">
            <input className="search" placeholder="Search by request ID, person, requester, or stage" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>{["All","In Approval","Partially Approved","Completed","Rejected"].map((status) => <option key={status}>{status}</option>)}</select>
          </div>

          <div className="two-col list-grid">
            <div className="stack">
              {filteredRequests.map((request) => (
                <button key={request.id} className={`list-card ${selectedRequest?.id === request.id ? "list-card-active" : ""}`} onClick={() => setSelectedRequest(request)}>
                  <div className="list-head">
                    <div><div className="list-title-row"><div className="list-title">{request.id}</div><span className={`badge badge-${statusTone(request.status)}`}>{request.status}</span></div><div className="muted">Requested for: {request.requestedFor}</div><div className="muted">Requester: {request.requester}</div><div className="muted">{request.typeOfChange} · {request.reason}</div></div>
                    <div className="muted right"><div>Stage: {request.stage}</div><div>Submitted: {request.submitted}</div><div>Due: {request.due}</div></div>
                  </div>
                </button>
              ))}
            </div>

            <div className="card inner-card">
              <div className="card-title">Request detail</div>
              {selectedRequest && (
                <div className="stack">
                  <div className="list-title-row"><div className="detail-title">{selectedRequest.id}</div><span className={`badge badge-${statusTone(selectedRequest.status)}`}>{selectedRequest.status}</span></div>
                  <div className="detail-grid">
                    <Info label="Requested for" value={selectedRequest.requestedFor} />
                    <Info label="Requester" value={selectedRequest.requester} />
                    <Info label="Type" value={selectedRequest.typeOfChange} />
                    <Info label="Reason" value={selectedRequest.reason} />
                    <Info label="Current stage" value={selectedRequest.stage} />
                    <Info label="Due" value={selectedRequest.due} />
                  </div>
                  <div className="stack"><div className="section-subtitle">Requested items</div>{selectedRequest.items.map((item) => <div key={item.id} className="subcard"><div className="list-head"><div><div className="select-title">{item.label}</div><div className="muted">{item.category}</div><div className="muted">Curriculum: {item.curriculum}</div><div className="muted">Approver: {item.approver}</div></div><span className="chip">{item.decision}</span></div></div>)}</div>
                  <button className="secondary-btn" onClick={() => setShowAudit(true)}>View audit trail</button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === "approvals" && (
        <section className="two-col">
          <div className="card"><div className="card-title">Approvals inbox</div><div className="stack">{requests.filter((r) => r.status !== "Completed" && r.status !== "Rejected").map((request) => <button key={request.id} className={`list-card ${selectedRequest?.id === request.id ? "list-card-active" : ""}`} onClick={() => setSelectedRequest(request)}><div className="list-head"><div><div className="list-title-row"><div className="list-title">{request.id}</div><span className={`badge badge-${statusTone(request.status)}`}>{request.status}</span></div><div className="muted">{request.requestedFor}</div><div className="muted">Current stage: {request.stage}</div></div><div className="muted right"><div>Due</div><div>{request.due}</div></div></div></button>)}</div></div>
          <div className="card"><div className="card-title">Approval action panel</div>{selectedRequest && <div className="stack"><div className="soft-box"><div className="select-title">{selectedRequest.id}</div><div className="muted">Requested for: {selectedRequest.requestedFor}</div><div className="muted">Stage: {selectedRequest.stage}</div></div><div className="stack"><div className="section-subtitle">Pending request items</div>{selectedRequest.items.map((item) => <div className="subcard" key={item.id}><div className="select-title">{item.label}</div><div className="muted">{item.category}</div><div className="muted">Approver path item owner: {item.approver}</div></div>)}</div><Field label="Approval comments"><textarea rows={5} value={approvalComment} onChange={(e) => setApprovalComment(e.target.value)} placeholder="Add approval, rejection, or send-back comments." /></Field><div className="button-row"><button className="primary-btn" onClick={() => actOnRequest("Approved")}>Approve</button><button className="secondary-btn" onClick={sendBackRequest}>Send back</button><button className="danger-btn" onClick={() => actOnRequest("Rejected")}>Reject</button></div></div>}</div>
        </section>
      )}

      {activeTab === "admin" && (
        <section className="two-col admin-grid">
          <div className="card"><div className="card-title">Admin-maintainable master data</div><div className="mini-grid">{restrictedAreas.slice(0, 8).map((area) => <div className="subcard" key={area.id}><div className="select-title">{area.areaName}</div><div className="muted">Curriculum: {area.curriculum}</div><div className="muted">Owner: {area.defaultOwner}</div></div>)}</div></div>
          <div className="stack"><div className="card"><div className="card-title">Automation rules</div><div className="stack"><div className="soft-box">Reminder after 4 business days</div><div className="soft-box">Parallel routing for multiple area owners</div><div className="soft-box">Partial approval supported</div><div className="soft-box">Security final completion required</div><div className="soft-box">Annual review reminder automation</div></div></div><div className="card"><div className="card-title">Exports</div><div className="stack"><button className="secondary-btn">Export executed PDF summary</button><button className="secondary-btn">Export annual review report</button></div></div></div>
        </section>
      )}

      {showAudit && selectedRequest && (
        <div className="modal-backdrop" onClick={() => setShowAudit(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head"><div className="card-title">Audit trail · {selectedRequest.id}</div><button className="secondary-btn" onClick={() => setShowAudit(false)}>Close</button></div>
            <div className="stack audit-stack">{selectedRequest.audit.map((entry, idx) => <div className="subcard" key={`${entry.timestamp}-${idx}`}><div className="list-head"><div className="select-title">{entry.action}</div><div className="muted">{entry.timestamp}</div></div><div className="muted">Actor: {entry.actor}</div><div>{entry.note}</div></div>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return <div className="metric-card"><div className="metric-label">{label}</div><div className="metric-value">{value}</div></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}
function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="section-head"><h3>{title}</h3><p>{subtitle}</p></div>;
}
function Info({ label, value }: { label: string; value: string }) {
  return <div className="info-box"><strong>{label}:</strong> {value}</div>;
}
