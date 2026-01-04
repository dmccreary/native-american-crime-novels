/* Hillerman Themes Concept Graph (vis-network.js)
   - Click node: highlights neighbors + shows details
   - Search: focuses node by label substring
   - Layout toggle: physics vs hierarchical
*/

const nodes = new vis.DataSet([
  // Core themes
  { id: "culture", label: "Culture", group: "core", title: "Cultural identity, language, kinship, and ways of knowing." },
  { id: "justice", label: "Justice", group: "core", title: "Justice as process: law, fairness, responsibility, consequences." },
  { id: "landscape", label: "Landscape", group: "core", title: "Place as character: mesas, canyons, roads, distance, weather." },
  { id: "belief", label: "Belief Systems", group: "core", title: "Spiritual practice, ceremony, taboos, ethics, balance." },

  // Bridge themes (connect cores)
  { id: "identity", label: "Identity", group: "bridge", title: "Personal and communal identity shaped by history and place." },
  { id: "language", label: "Language & Naming", group: "bridge", title: "Meaning carried in words, names, and translation." },
  { id: "community", label: "Community & Kinship", group: "bridge", title: "Obligations, clan ties, social trust, reputation." },
  { id: "trad_mod", label: "Tradition vs Modernity", group: "bridge", title: "Tension between contemporary life and older ways." },
  { id: "outsiders", label: "Outsiders & Contact", group: "bridge", title: "Cross-cultural misunderstanding, bias, cooperation, friction." },
  { id: "ethics", label: "Ethics & Responsibility", group: "bridge", title: "What one owes to others; moral choices under pressure." },
  { id: "order_chaos", label: "Order, Disorder, Balance", group: "bridge", title: "Restoring harmony after disruption; pattern vs noise." },
  { id: "story", label: "Story & Meaning", group: "bridge", title: "How narrative explains events; memory, rumor, and truth." },

  // Practice / institutions
  { id: "tribal_police", label: "Tribal Police", group: "practice", title: "Policing shaped by local relationships and jurisdiction." },
  { id: "law_custom", label: "Law vs Custom", group: "practice", title: "Formal law interacting with customary norms and remedies." },
  { id: "evidence", label: "Investigation & Evidence", group: "practice", title: "Clues, logic, forensics, interviews, and inference." },
  { id: "institutions", label: "Institutions", group: "practice", title: "Courts, agencies, churches, schools, outside authorities." },
  { id: "conflict", label: "Conflict & Power", group: "practice", title: "Resource disputes, corruption, coercion, leverage." },

  // Place / environment
  { id: "sacred", label: "Sacred Sites", group: "place", title: "Places with spiritual meaning; boundaries of respect." },
  { id: "ecology", label: "Ecology & Resources", group: "place", title: "Land use, extraction, scarcity, stewardship." },
  { id: "distance", label: "Distance & Isolation", group: "place", title: "Vast spaces affect timing, access, and vulnerability." },
  { id: "weather", label: "Weather & Time", group: "place", title: "Season, light, and time rhythms shaping events." },
  { id: "borders", label: "Boundaries & Jurisdiction", group: "place", title: "Where authority begins/ends; maps, roads, lines." },

  // Belief-related specifics
  { id: "ceremony", label: "Ceremony", group: "bridge", title: "Ritual acts as meaning-making and restoration." },
  { id: "taboo", label: "Taboo & Transgression", group: "bridge", title: "Violations that create fear, stigma, or spiritual risk." },
  { id: "hozho", label: "Healing & Balance (Hózhó)", group: "bridge", title: "Restoring harmony; wellness as relational." }
]);

const edges = new vis.DataSet([
  // Core-to-core
  { from: "culture", to: "belief", label: "intertwines" },
  { from: "culture", to: "justice", label: "frames" },
  { from: "landscape", to: "culture", label: "grounds" },
  { from: "landscape", to: "belief", label: "sanctifies" },
  { from: "justice", to: "belief", label: "tests" },

  // Culture cluster
  { from: "culture", to: "identity", label: "shapes" },
  { from: "culture", to: "language", label: "expresses" },
  { from: "culture", to: "community", label: "sustains" },
  { from: "culture", to: "trad_mod", label: "negotiates" },
  { from: "culture", to: "outsiders", label: "meets" },
  { from: "culture", to: "story", label: "remembers" },

  // Justice cluster
  { from: "justice", to: "tribal_police", label: "enacted by" },
  { from: "justice", to: "law_custom", label: "mediates" },
  { from: "justice", to: "evidence", label: "depends on" },
  { from: "justice", to: "institutions", label: "confronts" },
  { from: "justice", to: "ethics", label: "requires" },
  { from: "justice", to: "conflict", label: "opposes" },

  // Landscape cluster
  { from: "landscape", to: "distance", label: "imposes" },
  { from: "landscape", to: "weather", label: "drives" },
  { from: "landscape", to: "ecology", label: "contains" },
  { from: "landscape", to: "sacred", label: "holds" },
  { from: "landscape", to: "borders", label: "defines" },

  // Belief systems cluster
  { from: "belief", to: "ceremony", label: "includes" },
  { from: "belief", to: "taboo", label: "marks" },
  { from: "belief", to: "hozho", label: "aims for" },
  { from: "belief", to: "ethics", label: "guides" },
  { from: "belief", to: "story", label: "explains via" },

  // Bridges between clusters
  { from: "outsiders", to: "institutions", label: "arrive as" },
  { from: "borders", to: "tribal_police", label: "constrains" },
  { from: "law_custom", to: "belief", label: "collides with" },
  { from: "evidence", to: "story", label: "competes with" },
  { from: "conflict", to: "ecology", label: "over" },
  { from: "trad_mod", to: "tribal_police", label: "professionalizes" },
  { from: "community", to: "justice", label: "demands" },
  { from: "order_chaos", to: "hozho", label: "restores" },
  { from: "order_chaos", to: "justice", label: "seeks" },
  { from: "order_chaos", to: "culture", label: "protects" }
]);

const container = document.getElementById("network");

const optionsPhysics = {
  interaction: { hover: true, multiselect: false },
  physics: {
    enabled: true,
    solver: "forceAtlas2Based",
    forceAtlas2Based: { gravitationalConstant: -65, centralGravity: 0.01, springLength: 140, springConstant: 0.05 },
    stabilization: { iterations: 150 }
  },
  nodes: {
    shape: "ellipse",
    font: { color: "#0b0f14", size: 14 },
    borderWidth: 1
  },
  edges: {
    arrows: { to: { enabled: true, scaleFactor: 0.7 } },
    font: { color: "#ffffff", size: 11, align: "middle", strokeWidth: 0 },
    smooth: { enabled: true, type: "dynamic" }
  },
  groups: {
    core: { size: 26 },
    bridge: { size: 18 },
    practice: { size: 18 },
    place: { size: 18 }
  }
};

const optionsHier = {
  ...optionsPhysics,
  physics: { enabled: false },
  layout: {
    hierarchical: {
      enabled: true,
      direction: "LR",
      sortMethod: "directed",
      levelSeparation: 170,
      nodeSpacing: 140
    }
  }
};

const data = { nodes, edges };
const network = new vis.Network(container, data, optionsPhysics);

network.once("stabilized", () => {
  network.fit();
});

// Color per group (kept minimal, no manual palette explosion)
function applyGroupColors() {
  const groupStyles = {
    core:   { color: { background: "#ffd166", border: "rgba(255,255,255,0.35)" }, font: { color: "#0b0f14" } },
    bridge: { color: { background: "#7aa2ff", border: "rgba(255,255,255,0.35)" }, font: { color: "#0b0f14" } },
    practice:{ color:{ background: "#8bd3c7", border:"rgba(255,255,255,0.35)" }, font:{ color:"#0b0f14" } },
    place:  { color: { background: "#b39ddb", border: "rgba(255,255,255,0.35)" }, font: { color: "#0b0f14" } }
  };

  nodes.forEach(n => {
    const style = groupStyles[n.group];
    if (style) nodes.update({ id: n.id, ...style });
  });
}
applyGroupColors();

// Selection details + neighbor highlighting
const detailsBox = document.getElementById("detailsBox");

function showDetails(nodeId) {
  const n = nodes.get(nodeId);
  if (!n) return;

  const connected = network.getConnectedNodes(nodeId);
  const neighborLabels = connected
    .map(id => nodes.get(id))
    .filter(Boolean)
    .map(x => x.label)
    .sort((a,b) => a.localeCompare(b));

  detailsBox.innerHTML = `
    <div style="color:#e6edf6; font-weight:600; margin-bottom:6px;">${escapeHtml(n.label)}</div>
    <div style="margin-bottom:8px;">${escapeHtml(stripHtml(n.title || ""))}</div>
    <div style="color:#e6edf6; font-weight:600; margin-bottom:6px;">Connected themes</div>
    <div>${neighborLabels.map(escapeHtml).join(", ")}</div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function stripHtml(str) {
  return String(str).replace(/<[^>]*>/g, "");
}

function dimAllExcept(nodeId) {
  const keep = new Set([nodeId, ...network.getConnectedNodes(nodeId)]);
  nodes.forEach(n => {
    const isKeep = keep.has(n.id);
    nodes.update({
      id: n.id,
      opacity: isKeep ? 1.0 : 0.18
    });
  });
  edges.forEach(e => {
    const isKeep = keep.has(e.from) && keep.has(e.to);
    edges.update({
      id: e.id,
      opacity: isKeep ? 0.9 : 0.12
    });
  });
}

function resetOpacity() {
  nodes.forEach(n => nodes.update({ id: n.id, opacity: 1.0 }));
  edges.forEach(e => edges.update({ id: e.id, opacity: 0.9 }));
}

network.on("click", (params) => {
  if (params.nodes.length === 0) {
    resetOpacity();
    detailsBox.textContent = "Click a node to see details here.";
    return;
  }
  const nodeId = params.nodes[0];
  showDetails(nodeId);
  dimAllExcept(nodeId);
});

// Search focus
const searchBox = document.getElementById("searchBox");

function focusByQuery(q) {
  const query = q.trim().toLowerCase();
  if (!query) return;

  const all = nodes.get();
  const match = all.find(n => (n.label || "").toLowerCase().includes(query));
  if (!match) return;

  network.selectNodes([match.id]);
  network.focus(match.id, { scale: 1.2, animation: { duration: 500 } });
  showDetails(match.id);
  dimAllExcept(match.id);
}

searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") focusByQuery(searchBox.value);
});

// Layout toggle
const layoutSelect = document.getElementById("layoutSelect");
layoutSelect.addEventListener("change", () => {
  const mode = layoutSelect.value;
  network.setOptions(mode === "hierarchical" ? optionsHier : optionsPhysics);
  // small nudge so users see a change immediately
  resetOpacity();
  network.fit({ animation: { duration: 450 } });
});

// Reset
document.getElementById("resetBtn").addEventListener("click", () => {
  searchBox.value = "";
  resetOpacity();
  network.unselectAll();
  detailsBox.textContent = "Click a node to see details here.";
  network.fit({ animation: { duration: 450 } });
});
