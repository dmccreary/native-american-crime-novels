/* Hillerman Themes Concept Graph (vis-network.js)
   - Click node: highlights neighbors + shows details
   - Search: focuses node by label substring
   - Layout toggle: physics vs hierarchical
*/

const container = document.getElementById("network");
const detailsBox = document.getElementById("detailsBox");
const searchBox = document.getElementById("searchBox");
const layoutSelect = document.getElementById("layoutSelect");

let nodes, edges, network;

const optionsPhysics = {
  interaction: { hover: true, multiselect: false },
  physics: {
    enabled: true,
    solver: "forceAtlas2Based",
    forceAtlas2Based: { gravitationalConstant: -80, centralGravity: 0.008, springLength: 180, springConstant: 0.04 },
    stabilization: { iterations: 200 }
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
    place: { size: 18 },
    character: { size: 24 },
    book: { size: 20 }
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

// Load data and initialize network
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    nodes = new vis.DataSet(data.nodes);
    edges = new vis.DataSet(data.edges);

    network = new vis.Network(container, { nodes, edges }, optionsPhysics);

    network.once("stabilized", () => {
      network.fit();
    });

    applyGroupColors();
    setupEventListeners();
  })
  .catch(error => {
    console.error("Error loading data:", error);
    container.innerHTML = "<p style='color:#ff6b6b;padding:20px;'>Error loading graph data.</p>";
  });

// Color per group
function applyGroupColors() {
  const groupStyles = {
    core:     { color: { background: "#ffd166", border: "rgba(255,255,255,0.35)" }, font: { color: "#0b0f14" } },
    bridge:   { color: { background: "#7aa2ff", border: "rgba(255,255,255,0.35)" }, font: { color: "#0b0f14" } },
    practice: { color: { background: "#8bd3c7", border: "rgba(255,255,255,0.35)" }, font: { color: "#0b0f14" } },
    place:    { color: { background: "#b39ddb", border: "rgba(255,255,255,0.35)" }, font: { color: "#0b0f14" } },
    character:{ color: { background: "#ff8a65", border: "rgba(255,255,255,0.35)" }, font: { color: "#0b0f14" } },
    book:     { color: { background: "#a5d6a7", border: "rgba(255,255,255,0.35)" }, font: { color: "#0b0f14" } }
  };

  nodes.forEach(n => {
    const style = groupStyles[n.group];
    if (style) nodes.update({ id: n.id, ...style });
  });
}

// Selection details + neighbor highlighting
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

// Search focus
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

// Setup all event listeners
function setupEventListeners() {
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

  searchBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") focusByQuery(searchBox.value);
  });

  layoutSelect.addEventListener("change", () => {
    const mode = layoutSelect.value;
    network.setOptions(mode === "hierarchical" ? optionsHier : optionsPhysics);
    resetOpacity();
    network.fit({ animation: { duration: 450 } });
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    searchBox.value = "";
    resetOpacity();
    network.unselectAll();
    detailsBox.textContent = "Click a node to see details here.";
    network.fit({ animation: { duration: 450 } });
  });
}
