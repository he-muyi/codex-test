const app = document.querySelector('#app');

const iconPaths = {
  radar: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v8.5l5.8-5.8M4.5 12h15M12 20.5A8.5 8.5 0 0 1 3.5 12"/>',
  bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8.5h18C21 16 18 16 18 9ZM10 21h4"/>',
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  database: '<ellipse cx="12" cy="5" rx="7.5" ry="3"/><path d="M4.5 5v7c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V5M4.5 12v7c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-7"/>',
  brain: '<path d="M9.5 4.2A3.2 3.2 0 0 0 4 6.5a3.2 3.2 0 0 0 .5 5.8A3.2 3.2 0 0 0 7.5 18a3.2 3.2 0 0 0 5 1.4 3.2 3.2 0 0 0 5-1.4 3.2 3.2 0 0 0 3-5.7 3.2 3.2 0 0 0 .5-5.8 3.2 3.2 0 0 0-5.5-2.3 3.3 3.3 0 0 0-6 0Z"/><path d="M9 8.5v7M15 8.5v7M9 12h6M7 10h2M15 10h2M7 14h2M15 14h2"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M8 9h8M8 13h8M8 17h5"/>',
  play: '<path d="m9 6 9 6-9 6V6Z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/>',
  settings: '<path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3.1 1.3v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3.1-1.3l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-1.3-3.1h-.2a1.8 1.8 0 0 1 0-3.6h.2a1.8 1.8 0 0 0 1.3-3.1l-.1-.1A1.8 1.8 0 0 1 7 2.6l.1.1a1.8 1.8 0 0 0 3.1-1.3v-.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3.1 1.3l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 1.3 3.1h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-1.3 3.1Z"/>',
  chart: '<path d="M4 19V5M4 19h16"/><path d="m7 15 3-4 3 2 4-6"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4.5 4.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  layers: '<path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z"/><path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5"/>',
  download: '<path d="M12 3v12M7.5 11.5 12 16l4.5-4.5M4 20h16"/>',
  ship: '<path d="m4 15 3-7h10l3 7-8 3-8-3Z"/><path d="M3 19c2 2 4 2 6 0 2 2 4 2 6 0 2 2 4 2 6 0M7 8V5h5l2 3"/>',
  drone: '<path d="M5 8h4l3 4 3-4h4M5 8l-2 4h5M19 8l2 4h-5M12 12v6M9 20h6"/>',
  eye: '<path d="M2.5 12s3.4-5 9.5-5 9.5 5 9.5 5-3.4 5-9.5 5-9.5-5-9.5-5Z"/><circle cx="12" cy="12" r="2.4"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5ZM4 5.5V21"/>',
  radio: '<circle cx="12" cy="12" r="3"/><path d="M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8M2.8 2.8a13 13 0 0 0 0 18.4M21.2 2.8a13 13 0 0 1 0 18.4"/>',
  filter: '<path d="M4 5h16M7 12h10M10 19h4"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.7-4L3 10M4 4v6h6M4 13a8 8 0 0 0 14.7 4L21 14m-1 6v-6h-6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  message: '<path d="M4 5h16v11H8l-4 4V5Z"/><path d="M8 9h8M8 12h5"/>',
  shield: '<path d="M12 3 20 6v5c0 5.3-3.4 8.8-8 10-4.6-1.2-8-4.7-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
  timer: '<circle cx="12" cy="13" r="7"/><path d="M12 9v4l2.5 1.5M9 3h6M12 3v3"/>',
  box: '<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/>',
  terminal: '<path d="m5 8 4 4-4 4M12 17h6"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>'
};

function icon(name, size = '') {
  return `<svg class="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.dashboard}</svg>`;
}

const navGroups = [
  { label: '指挥中心', items: [
    ['dashboard', '全域态势', 'dashboard'],
    ['bell', '预警中心', 'alerts'],
    ['compass', '应急调度', 'dispatch']
  ]},
  { label: '业务应用', items: [
    ['database', '数据治理', 'data'],
    ['brain', 'AI 监测分析', 'ai'],
    ['book', '预案管理', 'plans'],
    ['play', '推演仿真', 'simulation']
  ]},
  { label: '系统支撑', items: [
    ['chart', '统计报表', 'reports'],
    ['settings', '系统后台', 'system']
  ]}
];

const state = {
  view: 'dashboard', mapMode: 'network', search: '', acknowledged: [], dispatches: 12,
  simulation: { hour: 0, duration: 24, running: false, completed: false },
  alerts: [
    { id: 1, level: 'high', name: '疑似船舶碰撞', meta: '渤海湾 · 39.62°N, 119.07°E', time: '09:42', kind: '船舶险情' },
    { id: 2, level: 'mid', name: '溢油漂移预警', meta: '黄海北部 · 影响面积 2.4 km²', time: '09:18', kind: '海上污染' },
    { id: 3, level: 'mid', name: '赤潮风险升高', meta: '山东近岸 · AI 置信度 92.6%', time: '08:56', kind: '生态异常' },
    { id: 4, level: 'low', name: '浮标水温异常', meta: '莱州湾 07 号 · 较基线 +2.1℃', time: '08:31', kind: '传感监测' }
  ],
  resources: [
    { name: '鲁救 01', type: '专业救助船', eta: '12 min', state: '可调度', icon: 'ship' },
    { name: '海巡 116', type: '海事巡逻船', eta: '28 min', state: '执行中', icon: 'ship', busy: true },
    { name: 'DJI M350-03', type: '无人机', eta: '待命', state: '可调度', icon: 'drone' },
    { name: '清污队 A-07', type: '现场队伍', eta: '41 min', state: '可调度', icon: 'user' }
  ]
};

window.rescueSimulationState = state.simulation;
let simulationTimer = null;

function formatSimulationTime(hour) {
  const safeHour = Math.max(0, Math.min(24, Number(hour) || 0));
  return `T + ${String(Math.floor(safeHour)).padStart(2, '0')}:00`;
}

function simulationStatus() {
  if (state.simulation.running) return '模型运行中 · 正在计算扩散与漂移';
  if (state.simulation.completed) return '推演完成 · 可拖动时间线回放';
  if (state.simulation.hour > 0) return '模型已暂停 · 可继续推演或拖动回放';
  return '模型待命 · 点击启动推演';
}

function updateSimulationUi() {
  const sim = state.simulation;
  const progress = Math.round((sim.hour / sim.duration) * 100);
  document.querySelectorAll('[data-sim-clock]').forEach(el => { el.textContent = formatSimulationTime(sim.hour); });
  document.querySelectorAll('[data-sim-status]').forEach(el => { el.textContent = simulationStatus(); });
  document.querySelectorAll('[data-sim-progress]').forEach(el => { el.style.width = `${progress}%`; });
  document.querySelectorAll('[data-sim-range]').forEach(el => { el.value = String(sim.hour); });
  document.querySelectorAll('[data-action="start-sim"]').forEach(el => {
    el.innerHTML = `${icon(sim.running ? 'pause' : 'play')} ${sim.running ? '暂停推演' : sim.completed ? '重新开始' : '启动推演'}`;
    el.classList.toggle('running', sim.running);
  });
}

function syncSimulationMap() {
  window.rescueMapApi?.setSimulationHour?.(state.simulation.hour);
}

function stopSimulationTimer() {
  if (simulationTimer) window.clearInterval(simulationTimer);
  simulationTimer = null;
}

function setSimulationHour(hour, stop = true) {
  if (stop) {
    state.simulation.running = false;
    stopSimulationTimer();
  }
  state.simulation.hour = Math.max(0, Math.min(state.simulation.duration, Number(hour) || 0));
  state.simulation.completed = state.simulation.hour >= state.simulation.duration;
  syncSimulationMap();
  updateSimulationUi();
}

function startSimulation() {
  const sim = state.simulation;
  if (sim.running) {
    sim.running = false;
    stopSimulationTimer();
    updateSimulationUi();
    toast(`推演已暂停 · ${formatSimulationTime(sim.hour)}`);
    return;
  }
  if (sim.completed) sim.hour = 0;
  sim.completed = false;
  sim.running = true;
  syncSimulationMap();
  updateSimulationUi();
  stopSimulationTimer();
  simulationTimer = window.setInterval(() => {
    sim.hour = Math.min(sim.duration, sim.hour + 1);
    sim.completed = sim.hour >= sim.duration;
    syncSimulationMap();
    updateSimulationUi();
    if (sim.completed) {
      sim.running = false;
      stopSimulationTimer();
      updateSimulationUi();
      toast('推演完成 · 已生成 24 小时扩散预测');
    }
  }, 1000);
  toast('仿真任务已启动，地图将按时间线模拟油膜扩散');
}

function navTemplate() {
  return navGroups.map(group => `<div class="nav-caption">${group.label}</div><nav class="nav">${group.items.map(([ico, label, id]) => `<button class="nav-item ${state.view === id ? 'active' : ''}" data-view="${id}">${icon(ico)}<span>${label}</span></button>`).join('')}</nav>`).join('');
}

function mapTemplate(extraClass = '', stage = false) {
  return `<div class="map-wrap ${state.mapMode} ${extraClass}">
    <div id="map-canvas" class="real-map" aria-label="真实地理地图"></div>
    <div class="map-fallback-note">真实底图加载中…</div>
    <div class="map-grid"></div><div class="map-coast"></div>
    <svg class="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M6 62 C24 47, 34 70, 50 54 S77 38, 99 52"/><path d="M2 28 C20 38, 22 14, 46 32 S75 62, 98 20"/><path d="M18 92 C37 73, 66 81, 88 67"/></svg>
    <div class="route"></div><div class="route route-two"></div><div class="map-radar"></div>
    <span class="map-label a">渤海湾</span><span class="map-label b">黄海北部</span><span class="map-label c">山东近岸海域</span>
    <div class="map-point p1"><span class="point-core"></span><span class="point-label">碰撞险情 · 一级</span></div>
    <div class="map-point p2 warning"><span class="point-core"></span><span class="point-label">油膜扩散区</span></div>
    <div class="map-point p3 warning"><span class="point-core"></span><span class="point-label">赤潮疑似区</span></div>
    <div class="map-point p4 resource"><span class="point-core"></span><span class="point-label">鲁救 01</span></div>
    <div class="map-point p5 resource"><span class="point-core"></span><span class="point-label">DJI M350-03</span></div>
    <div class="map-controls"><button class="map-control" data-map-action="zoom-in" aria-label="放大">＋</button><button class="map-control" data-map-action="zoom-out" aria-label="缩小">－</button><button class="map-control" data-map-action="locate" aria-label="定位">${icon('compass')}</button></div>
    <div class="map-legend"><span class="legend-item"><i class="legend-dot"></i>高风险事件</span><span class="legend-item"><i class="legend-dot amber"></i>预警区域</span><span class="legend-item"><i class="legend-dot blue"></i>应急资源</span></div>
    <span class="provider">${state.mapMode === 'earth' ? 'Cesium 三维数字地球 · WGS84' : state.mapMode === 'satellite' ? '天地图遥感 · Esri 兜底已就绪' : '天地图路网 · 自动容错已开启'}</span>
  </div>`;
}

function metricsTemplate() {
  const metrics = [
    ['今日监测事件', '24', '起', '+18.4% 较昨日', 'bell'],
    ['待处置预警', String(state.alerts.filter(a => !state.acknowledged.includes(a.id)).length).padStart(2, '0'), '项', '2 项高风险', 'radar', 'warn'],
    ['在线应急资源', '86', '台 / 队', '98.2% 状态正常', 'ship'],
    ['平均响应时效', '08:42', '', '较上周缩短 16%', 'timer']
  ];
  return `<div class="metrics">${metrics.map(([label, value, unit, trend, ico, cls]) => `<div class="metric"><div class="metric-icon">${icon(ico)}</div><div class="metric-label">${label}</div><div class="metric-value">${value}<span class="metric-unit">${unit}</span></div><div class="metric-trend ${cls || ''}">${trend}</div></div>`).join('')}</div>`;
}

function alertTemplate(alert) {
  const levelLabel = { high: '一级 · 紧急', mid: '二级 · 关注', low: '三级 · 提醒' }[alert.level];
  return `<div class="alert-item" data-alert-id="${alert.id}"><span class="alert-marker ${alert.level === 'mid' ? 'amber' : alert.level === 'low' ? 'blue' : ''}"></span><div class="alert-main"><div class="alert-name">${alert.name}</div><div class="alert-meta">${alert.meta}</div><span class="priority ${alert.level === 'high' ? 'high' : alert.level === 'mid' ? 'mid' : 'low'}">${levelLabel}</span></div><span class="alert-time">${alert.time}</span></div>`;
}

function dashboardView() {
  const pending = state.alerts.filter(a => !state.acknowledged.includes(a.id));
  return `<section class="view active" data-section="dashboard">
    <div class="dashboard-head"><div><div class="eyebrow">COMMAND CENTER / 01</div><h1 class="view-heading">全域态势指挥</h1><p class="view-description">山东近岸海域 · 数据更新时间 09:46:12 · 监测范围 42,800 km²</p></div><div class="head-actions"><div class="segmented"><button class="segment ${state.mapMode === 'network' ? 'active' : ''}" data-mapmode="network">二维路网</button><button class="segment ${state.mapMode === 'satellite' ? 'active' : ''}" data-mapmode="satellite">二维卫星</button><button class="segment ${state.mapMode === 'earth' ? 'active' : ''}" data-mapmode="earth">三维地球</button></div><button class="btn primary" data-action="new-alert">${icon('plus')} 新建险情</button></div></div>
    ${metricsTemplate()}
    <div class="dashboard-grid"><div class="panel map-panel"><div class="panel-header"><div class="panel-title">二三维一体化态势图</div><div class="panel-tools"><button class="text-btn" data-action="layer-panel">${icon('layers')} 图层</button><button class="text-btn" data-action="full-map">${icon('map')} 全屏</button></div></div>${mapTemplate()}</div>
      <div class="panel alert-panel"><div class="panel-header"><div class="panel-title">实时预警 <span class="tag orange">${pending.length} 待核查</span></div><button class="text-btn" data-view="alerts">查看全部</button></div><div class="alert-list">${pending.length ? pending.map(alertTemplate).join('') : '<div class="empty">当前没有待核查预警<br><span class="muted">系统正在持续监测</span></div>'}</div></div></div>
    <div class="bottom-grid"><div class="panel"><div class="panel-header"><div class="panel-title">应急资源状态</div><button class="text-btn" data-view="dispatch">资源一张图</button></div><div class="resource-body">${state.resources.map(r => `<div class="resource-row"><div class="resource-name">${icon(r.icon)}${r.name}</div><div class="resource-type">${r.type}</div><div class="resource-eta mono">${r.eta}</div><div class="resource-state ${r.busy ? 'busy' : ''}"><i class="status-dot"></i>${r.state}</div></div>`).join('')}</div></div>
      <div class="panel"><div class="panel-header"><div class="panel-title">今日值班动态</div><button class="text-btn" data-action="export-log">${icon('download')} 导出</button></div><div class="timeline"><div class="timeline-row warn"><i class="timeline-dot"></i><i class="timeline-line"></i><div class="timeline-content"><div class="timeline-title">溢油漂移预警已升级为二级关注</div><div class="timeline-desc">AI 监测引擎 · 自动评估 · 已通知值班组</div><div class="timeline-time">09:18:32</div></div></div><div class="timeline-row"><i class="timeline-dot"></i><i class="timeline-line"></i><div class="timeline-content"><div class="timeline-title">鲁救 01 已接收清污任务</div><div class="timeline-desc">指挥调度台 · 工单 #SR-20260915-008</div><div class="timeline-time">09:12:08</div></div></div><div class="timeline-row"><i class="timeline-dot"></i><i class="timeline-line"></i><div class="timeline-content"><div class="timeline-title">卫星影像 GF-6 完成入库</div><div class="timeline-desc">数据治理流水线 · 质量校验通过</div><div class="timeline-time">08:47:16</div></div></div></div></div></div>
  </section>`;
}

function alertsView() {
  return `<section class="view active"><div class="dashboard-head"><div><div class="eyebrow">RISK OPERATIONS / 02</div><h1 class="view-heading">预警中心</h1><p class="view-description">统一核查 AI 识别、传感器和人工上报的海上风险事件。</p></div><div class="head-actions"><button class="btn" data-action="mark-all">${icon('check')} 全部确认</button><button class="btn primary" data-action="new-alert">${icon('plus')} 新建险情</button></div></div><div class="page-tools"><div class="search">${icon('search')}<input data-search placeholder="搜索事件名称、海域或编号" value="${state.search}" /></div><button class="btn">${icon('filter')} 筛选</button><div class="muted" style="margin-left:auto;font-size:12px">自动刷新 <span class="mono" style="color:var(--teal)">00:28</span></div></div><div class="panel"><table class="data-table"><thead><tr><th>风险事件</th><th>事发海域</th><th>等级</th><th>AI 置信度</th><th>状态</th><th>更新时间</th><th></th></tr></thead><tbody>${state.alerts.map((a,i) => `<tr data-search-row="${a.name} ${a.meta} ${a.kind}"><td><strong>${a.name}</strong><div class="muted">${a.kind}</div></td><td>${a.meta.split(' · ')[0]}</td><td><span class="priority ${a.level === 'high' ? 'high' : a.level === 'mid' ? 'mid' : 'low'}">${a.level === 'high' ? '一级' : a.level === 'mid' ? '二级' : '三级'}</span></td><td class="mono">${['96.8','91.2','92.6','87.4'][i]}%</td><td><span class="table-status ${state.acknowledged.includes(a.id) ? '' : 'warn'}">${state.acknowledged.includes(a.id) ? '已确认' : '待核查'}</span></td><td class="mono">今天 ${a.time}</td><td><button class="text-btn" data-alert-id="${a.id}">${state.acknowledged.includes(a.id) ? '查看' : '确认'}</button></td></tr>`).join('')}</tbody></table></div></section>`;
}

function dataView() {
  return `<section class="view active"><div class="dashboard-head"><div><div class="eyebrow">DATA FABRIC / 03</div><h1 class="view-heading">数据治理</h1><p class="view-description">统一接入天、空、岸、海、水下多源数据，维护时空资产质量。</p></div><button class="btn primary" data-action="new-source">${icon('plus')} 新增数据源</button></div><div class="module-layout"><div class="module-grid"><div class="module-card"><div class="card-stat"><div><h3>已接入数据源</h3><p>卫星、AIS、浮标、雷达与业务台账</p></div><strong>28</strong></div><div class="progress"><span style="width:82%"></span></div><div class="muted" style="font-size:11px;margin-top:8px">23 个正常 · 3 个待校验 · 2 个已暂停</div></div><div class="module-card"><div class="card-stat"><div><h3>今日入库数据</h3><p>结构化时序与遥感影像</p></div><strong>1.86<span style="font-size:12px;color:var(--muted);margin-left:4px">TB</span></strong></div><div class="progress"><span style="width:64%;background:linear-gradient(90deg,#5c8dff,#9a86ff)"></span></div><div class="muted" style="font-size:11px;margin-top:8px">较昨日增长 12.8% · 质量校验 99.2%</div></div><div class="module-card"><div class="card-stat"><div><h3>治理流水线</h3><p>定时执行清洗、校验与坐标转换</p></div><strong>12</strong></div><div class="progress"><span style="width:91%;background:linear-gradient(90deg,#45df9b,#14d6cb)"></span></div><div class="muted" style="font-size:11px;margin-top:8px">9 个运行中 · 平均耗时 01:42</div></div><div class="module-card"><div class="card-stat"><div><h3>北斗网格覆盖率</h3><p>多源数据时空配准完成度</p></div><strong>96.4<span style="font-size:12px;color:var(--muted);margin-left:4px">%</span></strong></div><div class="progress"><span style="width:96%;background:linear-gradient(90deg,#ffbc62,#ff8a55)"></span></div><div class="muted" style="font-size:11px;margin-top:8px">WGS84 / GCJ02 / BD09 自动转换</div></div></div><div class="module-side"><div class="panel"><div class="panel-header"><div class="panel-title">服务健康度</div><button class="text-btn" data-view="system">配置</button></div><div style="padding:5px 17px 12px"><div class="check-row"><span>卫星影像接入</span><span class="check-value">正常</span></div><div class="check-row"><span>AIS 实时推送</span><span class="check-value">延迟 18s</span></div><div class="check-row"><span>浮标时序同步</span><span class="check-value">正常</span></div><div class="check-row"><span>对象存储</span><span class="check-value">72% 已用</span></div></div></div><div class="panel"><div class="panel-header"><div class="panel-title">最近流水线</div></div><div style="padding:8px 17px 14px"><div class="check-row"><span>ais-clean-and-grid</span><span class="tag green">运行中</span></div><div class="check-row"><span>gf6-oil-detection</span><span class="tag">已完成</span></div><div class="check-row"><span>buoy-quality-check</span><span class="tag orange">待处理</span></div></div></div></div></div></section>`;
}

function aiView() {
  return `<section class="view active"><div class="dashboard-head"><div><div class="eyebrow">AI INTELLIGENCE / 04</div><h1 class="view-heading">AI 监测分析</h1><p class="view-description">从遥感影像、AIS 航迹和浮标时序中识别异常并生成分级评估。</p></div><button class="btn primary" data-action="run-analysis">${icon('play')} 发起分析</button></div><div class="module-layout"><div class="module-grid"><div class="module-card"><div class="card-stat"><div><h3>溢油识别</h3><p>最近 24 小时 · 影像 18 景</p></div><strong style="color:var(--orange)">07</strong></div><div class="progress"><span style="width:78%;background:linear-gradient(90deg,#ffbc62,#ff6b76)"></span></div><div class="muted" style="font-size:11px;margin-top:8px">平均置信度 94.1% · 2 起待复核</div></div><div class="module-card"><div class="card-stat"><div><h3>船舶异常</h3><p>AIS 轨迹实时分析</p></div><strong style="color:var(--cyan)">16</strong></div><div class="progress"><span style="width:64%;background:linear-gradient(90deg,#5c8dff,#53d7ff)"></span></div><div class="muted" style="font-size:11px;margin-top:8px">非法停泊 9 · 偏航 7</div></div><div class="module-card"><div class="card-stat"><div><h3>赤潮 / 绿潮</h3><p>生态异常范围提取</p></div><strong style="color:var(--teal)">04</strong></div><div class="progress"><span style="width:52%;background:linear-gradient(90deg,#45df9b,#14d6cb)"></span></div><div class="muted" style="font-size:11px;margin-top:8px">本周新增 2 个疑似区域</div></div><div class="module-card"><div class="card-stat"><div><h3>模型服务</h3><p>在线算子与推理队列</p></div><strong>09</strong></div><div class="progress"><span style="width:89%"></span></div><div class="muted" style="font-size:11px;margin-top:8px">GPU 利用率 61% · 队列 3</div></div></div><div class="panel"><div class="panel-header"><div class="panel-title">最新分析结果</div><button class="text-btn" data-action="export-report">${icon('download')} 报告</button></div><div class="alert-list"><div class="alert-item"><span class="alert-marker"></span><div class="alert-main"><div class="alert-name">渤海湾疑似油膜</div><div class="alert-meta">GF-6 · 09:22 完成 · 面积 1.8 km²</div></div><span class="tag orange">高置信度</span></div><div class="alert-item"><span class="alert-marker amber"></span><div class="alert-main"><div class="alert-name">莱州湾赤潮疑似区</div><div class="alert-meta">Sentinel-2 · 08:56 完成 · 面积 5.6 km²</div></div><span class="tag">待复核</span></div><div class="alert-item"><span class="alert-marker blue"></span><div class="alert-main"><div class="alert-name">海巡 116 偏航行为</div><div class="alert-meta">AIS · 08:44 完成 · 偏离计划航线 2.1 海里</div></div><span class="tag green">已确认</span></div></div></div></div></section>`;
}

function plansView() {
  const plans = [['P-001', '船舶碰撞溢油专项预案', '船舶事故', '一级', 'v3.2', '2026-09-12', 'green'], ['P-002', '近岸风暴潮防御预案', '风暴潮', '一级 / 二级', 'v2.6', '2026-09-06', 'orange'], ['P-003', '赤潮生态灾害应急处置预案', '生态异常', '二级 / 三级', 'v1.8', '2026-08-29', 'purple'], ['P-004', '海上人员落水搜救预案', '人员搜救', '一级', 'v4.1', '2026-08-18', 'green']];
  return `<section class="view active"><div class="dashboard-head"><div><div class="eyebrow">PLAYBOOK LIBRARY / 05</div><h1 class="view-heading">预案管理</h1><p class="view-description">维护应急预案全生命周期，按事故类型、海域与风险等级快速匹配。</p></div><button class="btn primary" data-action="new-plan">${icon('plus')} 新建预案</button></div><div class="page-tools"><div class="search">${icon('search')}<input placeholder="搜索预案名称或编号" /></div><button class="btn">事故类型⌄</button><button class="btn">风险等级⌄</button><button class="btn">${icon('download')} 导出清单</button></div><div class="panel"><table class="data-table"><thead><tr><th>预案编号</th><th>预案名称</th><th>适用事故</th><th>风险等级</th><th>版本</th><th>更新时间</th><th>状态</th><th></th></tr></thead><tbody>${plans.map(p => `<tr><td class="mono">${p[0]}</td><td><strong>${p[1]}</strong></td><td><span class="tag">${p[2]}</span></td><td>${p[3]}</td><td class="mono">${p[4]}</td><td class="muted">${p[5]}</td><td><span class="tag ${p[6]}">已发布</span></td><td><button class="text-btn" data-action="view-plan">预览</button></td></tr>`).join('')}</tbody></table></div></section>`;
}

function simulationView() {
  const sim = state.simulation;
  const progress = Math.round((sim.hour / sim.duration) * 100);
  return `<section class="view active"><div class="dashboard-head"><div><div class="eyebrow">SCENARIO SIMULATION / 06</div><h1 class="view-heading">推演仿真</h1><p class="view-description">配置事故参数，按时间线模拟油膜扩散、漂移方向与应急资源响应。</p></div><div class="head-actions"><span class="tag green">推演引擎在线</span><button class="btn primary" data-action="start-sim">${icon(sim.running ? 'pause' : 'play')} ${sim.running ? '暂停推演' : sim.completed ? '重新开始' : '启动推演'}</button></div></div><div class="sim-layout"><div class="panel form-panel"><h3>事故参数配置</h3><div class="field"><label>推演场景</label><select><option>船舶碰撞 · 溢油扩散</option><option>风暴潮淹没影响</option><option>人员落水 · 漂移搜救</option></select></div><div class="field"><label>事发坐标</label><input value="39.62°N, 119.07°E" /></div><div class="field"><label>燃油泄漏量（吨）</label><input value="80" /></div><div class="field"><label>风力 / 风向</label><input value="6 级 · 东北风" /></div><div class="field"><label>洋流速度</label><input value="0.8 节 · 向东南" /></div><div class="field"><label>推演时长</label><select><option>24 小时</option><option>48 小时</option><option>72 小时</option></select></div><button class="btn primary" style="width:100%;margin-top:4px" data-action="start-sim">${icon(sim.running ? 'pause' : 'play')} ${sim.running ? '暂停推演' : sim.completed ? '重新开始' : '生成扩散预测'}</button><div class="sim-hint">点击启动后，每秒推进 1 小时；也可拖动地图下方时间线回放。</div></div><div class="panel sim-stage"><div class="panel-header"><div class="panel-title">扩散时序预览</div><div class="panel-tools"><span class="tag" data-sim-clock>${formatSimulationTime(sim.hour)}</span><button class="text-btn" data-action="stage-reset">${icon('refresh')} 重置</button></div></div>${mapTemplate('stage-map', true)}<div class="simulation-timeline"><div class="timeline-head"><span>推演时间线</span><strong data-sim-clock>${formatSimulationTime(sim.hour)}</strong></div><input class="sim-range" data-sim-range type="range" min="0" max="24" step="1" value="${sim.hour}" aria-label="推演时间线" /><div class="sim-ticks"><span>T+00</span><span>T+06</span><span>T+12</span><span>T+18</span><span>T+24</span></div><div class="sim-progress"><span data-sim-progress style="width:${progress}%"></span></div></div><div class="stage-footer"><div class="stage-status"><i class="status-dot"></i><span data-sim-status>${simulationStatus()}</span></div><div><button class="btn" data-action="export-report">${icon('download')} 评估报告</button></div></div></div></div></section>`;
}

function dispatchView() {
  return `<section class="view active"><div class="dashboard-head"><div><div class="eyebrow">FIELD DISPATCH / 07</div><h1 class="view-heading">应急调度工作台</h1><p class="view-description">从险情上报到现场处置，统一分派资源、跟踪进度并归档材料。</p></div><button class="btn primary" data-action="new-dispatch">${icon('plus')} 创建处置工单</button></div><div class="dashboard-grid"><div class="panel map-panel"><div class="panel-header"><div class="panel-title">资源一张图 <span class="tag green">86 在线</span></div><div class="panel-tools"><button class="text-btn">${icon('filter')} 资源筛选</button><button class="text-btn">${icon('layers')} 图层</button></div></div>${mapTemplate()}</div><div class="panel alert-panel"><div class="panel-header"><div class="panel-title">待办工单 <span class="tag orange">${state.dispatches} 项</span></div><button class="text-btn" data-action="export-report">导出</button></div><div class="alert-list"><div class="alert-item"><span class="alert-marker"></span><div class="alert-main"><div class="alert-name">#SR-20260915-008 清污处置</div><div class="alert-meta">渤海湾 · 鲁救 01 / 清污队 A-07</div><span class="priority high">执行中 · 68%</span></div><span class="alert-time">09:12</span></div><div class="alert-item"><span class="alert-marker amber"></span><div class="alert-main"><div class="alert-name">#SR-20260915-007 禁航警戒</div><div class="alert-meta">黄海北部 · 海巡 116</div><span class="priority mid">待接收</span></div><span class="alert-time">08:55</span></div><div class="alert-item"><span class="alert-marker blue"></span><div class="alert-main"><div class="alert-name">#SR-20260915-006 无人机巡查</div><div class="alert-meta">莱州湾 · DJI M350-03</div><span class="priority low">已完成</span></div><span class="alert-time">08:27</span></div></div></div></div><div class="bottom-grid"><div class="panel"><div class="panel-header"><div class="panel-title">资源推荐</div><button class="text-btn" data-action="recommend">重新计算</button></div><div class="resource-body">${state.resources.slice(0,3).map(r => `<div class="resource-row"><div class="resource-name">${icon(r.icon)}${r.name}</div><div class="resource-type">${r.type}</div><div class="resource-eta mono">${r.eta}</div><button class="text-btn" data-action="assign">派单</button></div>`).join('')}</div></div><div class="panel"><div class="panel-header"><div class="panel-title">协同会话</div><button class="text-btn">${icon('message')} 打开会话</button></div><div style="padding:15px 18px"><div class="muted" style="font-size:11px;margin-bottom:10px">3 个部门在线 · 最近指令</div><div style="font-size:13px"><span class="tag green">指挥长</span> 请海巡 116 先行建立警戒线，清污队保持安全距离。</div><div class="mono muted" style="font-size:10px;margin-top:8px">09:36:18 · 已送达</div></div></div></div></section>`;
}

function reportsView() {
  return `<section class="view active"><div class="dashboard-head"><div><div class="eyebrow">OPERATIONAL INSIGHTS / 08</div><h1 class="view-heading">统计报表</h1><p class="view-description">用处置时效、预警质量和资源投入衡量应急体系运行状态。</p></div><button class="btn primary" data-action="export-report">${icon('download')} 导出本月报告</button></div><div class="metrics"><div class="metric"><div class="metric-label">本月险情闭环</div><div class="metric-value">118<span class="metric-unit">起</span></div><div class="metric-trend">+8.7% 较上月</div></div><div class="metric"><div class="metric-label">预警准确率</div><div class="metric-value">94.6<span class="metric-unit">%</span></div><div class="metric-trend">+2.1pp 较上月</div></div><div class="metric"><div class="metric-label">平均处置时长</div><div class="metric-value">42<span class="metric-unit">min</span></div><div class="metric-trend">-16% 较上月</div></div><div class="metric"><div class="metric-label">资源使用率</div><div class="metric-value">76<span class="metric-unit">%</span></div><div class="metric-trend warn">高峰期 92%</div></div></div><div class="bottom-grid"><div class="panel"><div class="panel-header"><div class="panel-title">事件类型分布 · 近 30 天</div><button class="text-btn">按月切换</button></div><div style="padding:20px"><div style="display:grid;grid-template-columns:repeat(7,1fr);align-items:end;gap:10px;height:190px;border-bottom:1px solid var(--line)">${[42,61,48,83,58,95,72].map((v,i)=>`<div style="height:100%;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:8px"><span class="muted mono" style="font-size:10px">${v}</span><div style="height:${v}%;width:100%;border-radius:5px 5px 0 0;background:${i===5?'linear-gradient(#ff8a55,#ffbc62)':'linear-gradient(#13c8c0,#3985c2)'}"></div><span class="muted" style="font-size:10px">${['溢油','碰撞','风暴','落水','赤潮','偏航','其他'][i]}</span></div>`).join('')}</div></div></div><div class="panel"><div class="panel-header"><div class="panel-title">处置成效</div></div><div style="padding:9px 18px 17px"><div class="check-row"><span>预警到确认</span><strong class="check-value">06:18</strong></div><div class="check-row"><span>确认到派单</span><strong class="check-value">04:26</strong></div><div class="check-row"><span>派单到抵达</span><strong class="check-value">18:37</strong></div><div class="check-row"><span>现场到闭环</span><strong class="check-value">12:41</strong></div><div class="progress" style="margin-top:17px"><span style="width:86%"></span></div><div class="muted" style="font-size:11px;margin-top:7px">整体 SLA 达成率 86%</div></div></div></div></section>`;
}

function systemView() {
  return `<section class="view active"><div class="dashboard-head"><div><div class="eyebrow">PLATFORM ADMIN / 09</div><h1 class="view-heading">系统后台</h1><p class="view-description">维护账号权限、地图服务、AI 算子与全量审计日志。</p></div><button class="btn" data-action="save-settings">${icon('check')} 保存配置</button></div><div class="module-layout"><div class="module-grid"><div class="panel"><div class="panel-header"><div class="panel-title">地图服务配置</div><span class="tag green">自动容错</span></div><div style="padding:8px 17px 15px"><div class="check-row"><span>天地图 · 路网 / 卫星</span><span class="check-value">主服务</span></div><div class="check-row"><span>Esri · Satellite</span><span class="check-value">兜底服务</span></div><div class="check-row"><span>Cesium · 3D 地球</span><span class="check-value">已启用</span></div><div class="check-row"><span>默认视角</span><span class="mono muted">116.397389, 39.908722</span></div></div></div><div class="panel"><div class="panel-header"><div class="panel-title">角色与权限</div><button class="text-btn" data-action="manage-users">管理</button></div><div style="padding:8px 17px 15px"><div class="check-row"><span>应急指挥长</span><span class="tag purple">全功能</span></div><div class="check-row"><span>值班值守人员</span><span class="tag">基础操作</span></div><div class="check-row"><span>数据管理员</span><span class="tag green">数据域</span></div><div class="check-row"><span>行业技术专家</span><span class="tag orange">评审域</span></div></div></div><div class="panel"><div class="panel-header"><div class="panel-title">审计日志</div><button class="text-btn">查看全部</button></div><div style="padding:8px 17px 15px"><div class="check-row"><span>指令下发 · #SR-20260915-008</span><span class="mono muted">09:36</span></div><div class="check-row"><span>图层配置 · 值班员</span><span class="mono muted">09:28</span></div><div class="check-row"><span>用户登录 · 张海</span><span class="mono muted">09:02</span></div><div class="check-row"><span>模型参数更新 · 专家组</span><span class="mono muted">08:42</span></div></div></div><div class="panel"><div class="panel-header"><div class="panel-title">告警渠道</div><span class="tag green">4 / 4 正常</span></div><div style="padding:8px 17px 15px"><div class="check-row"><span>系统弹窗</span><span class="check-value">已启用</span></div><div class="check-row"><span>短信推送</span><span class="check-value">已启用</span></div><div class="check-row"><span>电话通知</span><span class="check-value">已启用</span></div><div class="check-row"><span>应急会话</span><span class="check-value">已启用</span></div></div></div></div><div class="module-side"><div class="panel"><div class="panel-header"><div class="panel-title">平台运行状态</div></div><div style="padding:4px 17px 15px"><div class="check-row"><span>WebGIS 服务</span><span class="check-value">正常</span></div><div class="check-row"><span>AI 推理引擎</span><span class="check-value">正常</span></div><div class="check-row"><span>消息队列</span><span class="check-value">正常</span></div><div class="check-row"><span>数据库</span><span class="check-value">正常</span></div><div class="check-row"><span>对象存储</span><span class="check-value">正常</span></div></div></div><div class="panel"><div class="panel-header"><div class="panel-title">当前用户</div></div><div style="padding:15px 17px"><div class="user"><div class="avatar">张</div><div><div class="user-name">张海</div><div class="user-role">应急指挥长 · 山东省海上搜救中心</div></div></div><div class="muted" style="font-size:11px;margin-top:17px">最近登录：2026-09-15 09:02:16</div></div></div></div></div></section>`;
}

function mainView() {
  const views = { dashboard: dashboardView, alerts: alertsView, data: dataView, ai: aiView, plans: plansView, simulation: simulationView, dispatch: dispatchView, reports: reportsView, system: systemView };
  return views[state.view] ? views[state.view]() : dashboardView();
}

function shell() {
  return `<div class="app-shell"><aside class="sidebar"><div class="brand"><div class="brand-mark">${icon('radar')}</div><div class="brand-copy"><div class="brand-title">海上搜救</div><div class="brand-sub">应急指挥平台</div></div></div><div style="flex:1">${navTemplate()}</div><div class="side-status"><div class="side-status-top"><span><i class="status-dot"></i>系统在线</span><span class="mono" style="font-size:10px">v2.4.1</span></div><strong>全域态势服务正常</strong><small>最后巡检 09:45:58</small></div></aside><main class="main"><header class="topbar"><div class="crumbs"><div class="eyebrow">MARITIME RESCUE / 2026</div><div class="page-title">海上搜救应急关键技术攻关及示范应用</div></div><div class="top-actions"><span class="live-time mono" id="live-time"></span><button class="icon-btn" data-action="show-notice" aria-label="通知">${icon('bell')}<i class="notif-dot"></i></button><div class="user"><div class="avatar">张</div><div class="user-copy"><div class="user-name">张海</div><div class="user-role">应急指挥长</div></div></div></div></header><div class="content">${mainView()}</div></main></div><div class="modal-backdrop" id="modal-backdrop"><div class="modal"><div class="modal-header"><h3 id="modal-title">创建险情</h3><button class="modal-close" data-action="close-modal">×</button></div><div class="modal-body" id="modal-body"></div><div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn primary" data-action="modal-confirm">确认提交</button></div></div></div><div class="toast" id="toast"></div>`;
}

function render() {
  window.rescueMapApi?.destroy?.();
  app.innerHTML = shell();
  const time = document.querySelector('#live-time');
  if (time) time.textContent = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
  window.dispatchEvent(new CustomEvent('rescue:rendered'));
}

function toast(message) {
  const el = document.querySelector('#toast');
  if (!el) return;
  el.textContent = message; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2600);
}

window.rescueToast = toast;

function openModal(type) {
  const backdrop = document.querySelector('#modal-backdrop');
  const title = document.querySelector('#modal-title');
  const body = document.querySelector('#modal-body');
  const configs = {
    alert: ['新建险情', `<div class="field"><label>险情类型</label><select><option>船舶碰撞</option><option>海上溢油</option><option>人员落水</option><option>风暴潮</option></select></div><div class="field"><label>事发海域</label><input placeholder="输入海域或坐标" value="渤海湾 39.62°N, 119.07°E" /></div><div class="field"><label>情况描述</label><input placeholder="简要描述险情现状" /></div>`],
    source: ['新增数据源', `<div class="field"><label>数据源名称</label><input placeholder="例如：某型浮标时序" /></div><div class="field"><label>接入协议</label><select><option>REST API</option><option>WebSocket</option><option>MQTT</option><option>文件批量</option></select></div><div class="field"><label>更新周期</label><select><option>实时</option><option>每 5 分钟</option><option>每小时</option></select></div>`],
    plan: ['新建应急预案', `<div class="field"><label>预案名称</label><input placeholder="输入预案名称" /></div><div class="field"><label>适用事故</label><select><option>船舶碰撞</option><option>海上溢油</option><option>风暴潮</option></select></div><div class="field"><label>适用风险等级</label><select><option>一级</option><option>二级</option><option>三级</option></select></div>`],
    dispatch: ['创建处置工单', `<div class="field"><label>关联险情</label><select><option>疑似船舶碰撞 · 渤海湾</option><option>溢油漂移预警 · 黄海北部</option></select></div><div class="field"><label>执行资源</label><select><option>鲁救 01 + 清污队 A-07</option><option>海巡 116</option><option>DJI M350-03</option></select></div><div class="field"><label>处置要求</label><input placeholder="填写现场指令" /></div>`]
  };
  const [t, b] = configs[type] || configs.alert; title.textContent = t; body.innerHTML = b; backdrop.classList.add('show'); backdrop.dataset.modalType = type;
}

document.addEventListener('click', (event) => {
  const viewTarget = event.target.closest('[data-view]');
  if (viewTarget) { state.view = viewTarget.dataset.view; state.search = ''; render(); return; }
  const mapMode = event.target.closest('[data-mapmode]');
  if (mapMode) { state.mapMode = mapMode.dataset.mapmode; render(); return; }
  const alertTarget = event.target.closest('[data-alert-id]');
  if (alertTarget) { const id = Number(alertTarget.dataset.alertId); if (!state.acknowledged.includes(id)) { state.acknowledged.push(id); toast('预警已确认，已进入处置流程'); render(); } else toast('已打开事件详情'); return; }
  const actionTarget = event.target.closest('[data-action]');
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;
  if (action === 'new-alert') openModal('alert');
  if (action === 'new-source') openModal('source');
  if (action === 'new-plan') openModal('plan');
  if (action === 'new-dispatch') openModal('dispatch');
  if (action === 'close-modal') document.querySelector('#modal-backdrop')?.classList.remove('show');
  if (action === 'modal-confirm') { document.querySelector('#modal-backdrop')?.classList.remove('show'); state.dispatches += 1; toast('已提交，系统正在进行智能匹配'); }
  if (action === 'mark-all') { state.acknowledged = state.alerts.map(a => a.id); render(); toast('全部预警已确认'); }
  if (action === 'start-sim') { startSimulation(); }
  if (action === 'run-analysis') { toast('AI 分析任务已进入队列，预计 02:18 完成'); }
  if (action === 'export-report' || action === 'export-log') { toast('报告已生成，正在准备下载'); }
  if (action === 'save-settings') { toast('系统配置已保存'); }
  if (action === 'recommend') { toast('已基于距离、负载和续航重新计算资源组合'); }
  if (action === 'assign') { toast('工单已派发，等待执行人员接收'); }
  if (action === 'layer-panel') { toast('图层面板已打开：AIS / 浮标 / 风险区 / 应急资源'); }
  if (action === 'full-map') { toast('已进入态势图专注模式'); }
  if (action === 'show-notice') { toast('有 2 条新的高风险事件通知'); }
  if (action === 'manage-users') { toast('用户权限管理已打开'); }
  if (action === 'stage-reset') { setSimulationHour(0); toast('已重置到推演初始时刻'); }
  if (action === 'zoom-in') { window.rescueMapApi?.zoomIn?.(); }
  if (action === 'zoom-out') { window.rescueMapApi?.zoomOut?.(); }
  if (action === 'locate') { window.rescueMapApi?.locate?.(); }
});

document.addEventListener('input', (event) => {
  const simulationRange = event.target.closest('[data-sim-range]');
  if (simulationRange) {
    setSimulationHour(simulationRange.value);
    return;
  }
  if (!event.target.matches('[data-search]')) return;
  const query = event.target.value.toLowerCase();
  document.querySelectorAll('[data-search-row]').forEach(row => { row.style.display = row.dataset.searchRow.toLowerCase().includes(query) ? '' : 'none'; });
});

render();
setInterval(() => { const time = document.querySelector('#live-time'); if (time) time.textContent = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'); }, 1000);
