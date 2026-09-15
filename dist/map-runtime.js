const MAP_CONFIG = window.RESCUE_MAP_CONFIG || {};
const TIANDITU_KEY = MAP_CONFIG.tiandituKey || '';
const TDT_SUBDOMAINS = ['0', '1', '2', '3', '4', '5', '6', '7'];
const REGION_CENTER = [119.2, 39.2];
let runtime = null;

const mapPoints = [
  { id: 'collision', lon: 119.07, lat: 39.62, label: '碰撞险情 · 一级', detail: '疑似船舶碰撞 · 渤海湾', color: '#ff6b76', size: 13, kind: 'incident' },
  { id: 'oil', lon: 119.32, lat: 38.92, label: '油膜扩散区', detail: '溢油漂移预警 · 影响面积 2.4 km²', color: '#ffbc62', size: 12, kind: 'oil' },
  { id: 'redtide', lon: 121.18, lat: 36.85, label: '赤潮疑似区', detail: '赤潮风险升高 · AI 置信度 92.6%', color: '#ffbc62', size: 12, kind: 'warning' },
  { id: 'rescue', lon: 119.45, lat: 39.30, label: '鲁救 01', detail: '专业救助船 · 预计 12 min 抵达', color: '#53d7ff', size: 11, kind: 'ship' },
  { id: 'drone', lon: 121.32, lat: 37.12, label: 'DJI M350-03', detail: '无人机 · 待命', color: '#53d7ff', size: 11, kind: 'drone' }
];

function svgData(svg) { return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`; }
function shipIcon(color = '#53d7ff') {
  return svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M9 37h46l-7 12H18L9 37Z" fill="#061722" stroke="#d9f8ff" stroke-width="2"/><path d="M21 37V20h19l7 17M25 20v-7h10v7M13 51c5 5 10 5 15 0 5 5 10 5 15 0 3 3 6 4 9 2" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 24h8" stroke="${color}" stroke-width="3" stroke-linecap="round"/></svg>`);
}

function simulationProgress(hour = 0) {
  const duration = Number(window.rescueSimulationState?.duration) || 24;
  return Math.max(0, Math.min(duration, Number(hour) || 0)) / duration;
}

function diffusionSnapshot(hour = 0) {
  const progress = simulationProgress(hour);
  const scenario = window.rescueSimulationState?.scenario || 'oil';
  const time = String(Math.round(progress * (Number(window.rescueSimulationState?.duration) || 24))).padStart(2, '0');
  if (scenario === 'storm') {
    const center = [118.84 + progress * 0.34, 39.06 + progress * 0.02];
    const length = 0.34 + progress * 0.92;
    const width = 0.20 + progress * 0.58;
    const polygon = [[center[0] - length * .90, center[1] + width * .10], [center[0] - length * .52, center[1] + width * .70], [center[0] - length * .08, center[1] + width * .42], [center[0] + length * .35, center[1] + width * .82], [center[0] + length * .86, center[1] + width * .30], [center[0] + length * .63, center[1] - width * .18], [center[0] + length * .20, center[1] - width * .74], [center[0] - length * .31, center[1] - width * .48], [center[0] - length * .80, center[1] - width * .64]];
    return { center, polygon: [...polygon, polygon[0]], label: `风暴潮淹没区 · T+${time}:00`, detail: `模拟淹没范围 ${(12 + progress * 46).toFixed(1)} km² · 水位 ${(1.4 + progress * 1.4).toFixed(1)} m`, fill: '#56c7dc', stroke: '#72e6f0', trail: '#56c7dc' };
  }
  if (scenario === 'person') {
    const center = [119.26 + progress * 0.28, 39.14 - progress * 0.22];
    const length = 0.12 + progress * 0.23;
    const width = 0.08 + progress * 0.18;
    const polygon = [[center[0] - length * .90, center[1] + width * .12], [center[0] - length * .48, center[1] + width * .70], [center[0] + length * .05, center[1] + width * .46], [center[0] + length * .82, center[1] + width * .22], [center[0] + length * .58, center[1] - width * .48], [center[0] + length * .05, center[1] - width * .76], [center[0] - length * .64, center[1] - width * .50]];
    return { center, polygon: [...polygon, polygon[0]], label: `漂移搜救区 · T+${time}:00`, detail: `模拟搜索范围 ${(0.8 + progress * 4.8).toFixed(1)} km² · 漂移 ${Math.round(progress * 9)} km`, fill: '#53d7ff', stroke: '#91edff', trail: '#53d7ff' };
  }
  const center = [119.30 + progress * 0.52, 38.96 - progress * 0.31];
  const length = 0.34 + progress * 0.78;
  const width = 0.18 + progress * 0.34;
  const polygon = [[center[0] - length * .78, center[1] + width * .08], [center[0] - length * .57, center[1] + width * .58], [center[0] - length * .16, center[1] + width * .35], [center[0] + length * .17, center[1] + width * .76], [center[0] + length * .65, center[1] + width * .37], [center[0] + length * .50, center[1] - width * .12], [center[0] + length * .12, center[1] - width * .70], [center[0] - length * .26, center[1] - width * .42], [center[0] - length * .76, center[1] - width * .62]];
  return { center, polygon: [...polygon, polygon[0]], label: `油膜扩散区 · T+${time}:00`, detail: `模拟扩散范围 ${(2.4 + progress ** 1.18 * 17.6).toFixed(1)} km² · 漂移 ${Math.round(progress * 18)} km`, fill: '#ffad54', stroke: '#ffbc62', trail: '#ffbc62' };
}

function activeWrap() { return document.querySelector('.map-wrap'); }
function activeMode() {
  const wrap = activeWrap();
  if (!wrap) return 'network';
  if (wrap.classList.contains('earth')) return 'earth';
  if (wrap.classList.contains('satellite')) return 'satellite';
  return 'network';
}
function setProvider(label) { const provider = activeWrap()?.querySelector('.provider'); if (provider) provider.textContent = label; }
function setReady(label) {
  const wrap = activeWrap();
  if (!wrap) return;
  wrap.classList.add('real-map-ready');
  wrap.classList.remove('map-fallback');
  const note = wrap.querySelector('.map-fallback-note');
  if (note) note.textContent = '';
  setProvider(label);
}
function setFallback(message, providerLabel) {
  const wrap = activeWrap();
  if (!wrap) return;
  wrap.classList.remove('real-map-ready');
  wrap.classList.add('map-fallback');
  const note = wrap.querySelector('.map-fallback-note');
  if (note) note.textContent = message;
  setProvider(providerLabel);
}
function tdtUrl(layer, key = TIANDITU_KEY) {
  return `https://t{s}.tianditu.gov.cn/${layer}_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${encodeURIComponent(key)}`;
}
function fallbackUrl(mode) {
  return mode === 'satellite'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png';
}

function labelsStyle(ol, color, label, size, kind = 'marker') {
  const image = kind === 'ship'
    ? new ol.style.Icon({ src: shipIcon(color), anchor: [0.5, 0.82], scale: 0.62 })
    : new ol.style.Circle({ radius: size / 2, fill: new ol.style.Fill({ color }), stroke: new ol.style.Stroke({ color: '#e7ffff', width: 1.5 }) });
  return new ol.style.Style({
    image,
    text: new ol.style.Text({
      text: label, offsetX: 12, offsetY: -10, font: '600 12px Noto Sans SC, sans-serif',
      fill: new ol.style.Fill({ color: '#e8fbff' }), stroke: new ol.style.Stroke({ color: 'rgba(2,12,20,.92)', width: 3 }),
      backgroundFill: new ol.style.Fill({ color: 'rgba(3,16,27,.76)' }), padding: [3, 5, 3, 5]
    })
  });
}

function createOpenLayersMap(element, mode) {
  const ol = window.ol;
  if (!ol) throw new Error('OpenLayers SDK 未加载');
  const useTdt = Boolean(TIANDITU_KEY);
  const baseUrl = useTdt ? tdtUrl(mode === 'satellite' ? 'img' : 'vec') : fallbackUrl(mode);
  const baseSource = new ol.source.XYZ({
    url: baseUrl, subdomains: useTdt ? TDT_SUBDOMAINS : undefined,
    attributions: useTdt ? '© 天地图' : mode === 'satellite' ? '© Esri World Imagery' : '© OpenStreetMap contributors'
  });
  const baseLayer = new ol.layer.Tile({ source: baseSource });
  const labelLayer = useTdt ? new ol.layer.Tile({ source: new ol.source.XYZ({ url: tdtUrl(mode === 'satellite' ? 'cia' : 'cva'), subdomains: TDT_SUBDOMAINS }) }) : null;
  const vectorSource = new ol.source.Vector();
  const vectorLayer = new ol.layer.Vector({ source: vectorSource });
  const points = mapPoints.filter(item => item.id !== 'oil').map(item => {
    const feature = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.fromLonLat([item.lon, item.lat])), rescueId: item.id, detail: item.detail });
    feature.setStyle(labelsStyle(ol, item.color, item.label, item.size, item.kind));
    return feature;
  });
  const initialDiffusion = diffusionSnapshot(0);
  const oilArea = new ol.Feature({ geometry: new ol.geom.Polygon([initialDiffusion.polygon.map(point => ol.proj.fromLonLat(point))]) });
  oilArea.setStyle(new ol.style.Style({ fill: new ol.style.Fill({ color: `${initialDiffusion.fill}33` }), stroke: new ol.style.Stroke({ color: initialDiffusion.stroke, width: 2, lineDash: [7, 5] }) }));
  const oilMarker = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.fromLonLat(initialDiffusion.center)), detail: initialDiffusion.detail });
  oilMarker.setStyle(labelsStyle(ol, initialDiffusion.stroke, initialDiffusion.label, 13));
  const oilTrail = new ol.Feature({ geometry: new ol.geom.LineString([ol.proj.fromLonLat(initialDiffusion.center), ol.proj.fromLonLat(initialDiffusion.center)]) });
  oilTrail.setStyle(new ol.style.Style({ stroke: new ol.style.Stroke({ color: initialDiffusion.trail, width: 2, lineDash: [5, 6] }) }));
  const route = new ol.Feature({ geometry: new ol.geom.LineString([ol.proj.fromLonLat([119.43, 39.29]), ol.proj.fromLonLat([119.25, 39.03]), ol.proj.fromLonLat([119.09, 38.91])]) });
  route.setStyle(new ol.style.Style({ stroke: new ol.style.Stroke({ color: '#53d7ff', width: 2.5, lineDash: [10, 7] }) }));
  vectorSource.addFeatures([oilArea, oilTrail, oilMarker, route, ...points]);
  const map = new ol.Map({
    target: element, layers: [baseLayer, ...(labelLayer ? [labelLayer] : []), vectorLayer],
    view: new ol.View({ center: ol.proj.fromLonLat(REGION_CENTER), zoom: 7.2, minZoom: 4, maxZoom: 16 }),
    controls: ol.control.defaults.defaults({ zoom: false, rotate: false })
  });
  map.on('singleclick', event => {
    map.forEachFeatureAtPixel(event.pixel, feature => {
      const detail = feature.get('detail');
      if (detail) window.rescueToast?.(detail);
      return true;
    });
  });
  baseSource.on('tileloaderror', () => {
    if (!useTdt || baseLayer.get('fallbackApplied')) return;
    baseLayer.set('fallbackApplied', true);
    baseLayer.setSource(new ol.source.XYZ({ url: fallbackUrl(mode), attributions: mode === 'satellite' ? '© Esri World Imagery' : '© OpenStreetMap contributors' }));
    if (labelLayer) map.removeLayer(labelLayer);
    setReady(mode === 'satellite' ? 'Esri Satellite · 天地图异常自动兜底' : 'OSM 路网 · 天地图异常自动兜底');
  });
  const setSimulationHour = (hour = 0) => {
    const snapshot = diffusionSnapshot(hour);
    oilArea.setGeometry(new ol.geom.Polygon([snapshot.polygon.map(point => ol.proj.fromLonLat(point))]));
    const alpha = Math.round((0.15 + simulationProgress(hour) * 0.22) * 255).toString(16).padStart(2, '0');
    oilArea.setStyle(new ol.style.Style({ fill: new ol.style.Fill({ color: `${snapshot.fill}${alpha}` }), stroke: new ol.style.Stroke({ color: snapshot.stroke, width: 2, lineDash: [7, 5] }) }));
    oilMarker.setGeometry(new ol.geom.Point(ol.proj.fromLonLat(snapshot.center)));
    oilMarker.set('detail', snapshot.detail);
    oilMarker.setStyle(labelsStyle(ol, snapshot.stroke, snapshot.label, 13 + Math.min(4, (Number(hour) || 0) / 8)));
    oilTrail.setGeometry(new ol.geom.LineString([ol.proj.fromLonLat(initialDiffusion.center), ol.proj.fromLonLat(snapshot.center)]));
    oilTrail.setStyle(new ol.style.Style({ stroke: new ol.style.Stroke({ color: snapshot.trail, width: 2, lineDash: [5, 6] }) }));
    map.render();
  };
  setReady(useTdt ? (mode === 'satellite' ? '天地图卫星 · WMTS 已接入' : '天地图路网 · WMTS 已接入') : (mode === 'satellite' ? 'Esri Satellite · 天地图不可用时自动兜底' : 'OSM 路网 · 天地图不可用时自动兜底'));
  setSimulationHour(window.rescueSimulationState?.hour || 0);
  requestAnimationFrame(() => map.updateSize());
  return {
    setSimulationHour,
    zoomIn: () => map.getView().setZoom(Math.min((map.getView().getZoom() || 7) + 1, 16)),
    zoomOut: () => map.getView().setZoom(Math.max((map.getView().getZoom() || 7) - 1, 4)),
    locate: () => map.getView().animate({ center: ol.proj.fromLonLat(REGION_CENTER), zoom: 7.2, duration: 500 }),
    destroy: () => { map.setTarget(undefined); map.dispose(); }
  };
}

function addCesiumEntities(viewer) {
  const Cesium = window.Cesium;
  for (const item of mapPoints.filter(item => item.id !== 'oil')) {
    const visual = item.kind === 'ship'
      ? { billboard: { image: shipIcon(item.color), width: 36, height: 36, verticalOrigin: Cesium.VerticalOrigin.BOTTOM, disableDepthTestDistance: Number.POSITIVE_INFINITY } }
      : { point: { pixelSize: item.size + 2, color: Cesium.Color.fromCssColorString(item.color), outlineColor: Cesium.Color.WHITE, outlineWidth: 2, disableDepthTestDistance: Number.POSITIVE_INFINITY } };
    viewer.entities.add({
      id: `rescue-${item.id}`, position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 30),
      ...visual,
      label: { text: item.label, font: '600 12px Noto Sans SC, sans-serif', fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.BLACK, outlineWidth: 3, style: Cesium.LabelStyle.FILL_AND_OUTLINE, showBackground: true, backgroundColor: Cesium.Color.fromCssColorString('rgba(3,16,27,.80)'), pixelOffset: new Cesium.Cartesian2(10, -10), disableDepthTestDistance: Number.POSITIVE_INFINITY },
      properties: { detail: item.detail }
    });
  }
  const initialDiffusion = diffusionSnapshot(0);
  viewer.entities.add({ id: 'oil-area', polygon: { hierarchy: Cesium.Cartesian3.fromDegreesArray(initialDiffusion.polygon.flat()), material: Cesium.Color.fromCssColorString(initialDiffusion.fill).withAlpha(.20), outline: true, outlineColor: Cesium.Color.fromCssColorString(initialDiffusion.stroke), outlineWidth: 2 } });
  viewer.entities.add({ id: 'rescue-route', polyline: { positions: Cesium.Cartesian3.fromDegreesArray([119.43, 39.29, 119.25, 39.03, 119.09, 38.91]), width: 3, material: new Cesium.PolylineDashMaterialProperty({ color: Cesium.Color.fromCssColorString('#53d7ff'), dashLength: 14 }) } });
}

function createCesiumMap(element) {
  const Cesium = window.Cesium;
  if (!Cesium) throw new Error('Cesium SDK 未加载');
  const imageryProvider = TIANDITU_KEY
    ? new Cesium.UrlTemplateImageryProvider({ url: tdtUrl('img'), subdomains: TDT_SUBDOMAINS, credit: '天地图' })
    : new Cesium.OpenStreetMapImageryProvider({ url: 'https://tile.openstreetmap.org/' });
  const viewer = new Cesium.Viewer(element, {
    baseLayer: new Cesium.ImageryLayer(imageryProvider), baseLayerPicker: false, geocoder: false, homeButton: false,
    sceneModePicker: false, animation: false, timeline: false, navigationHelpButton: false, fullscreenButton: false,
    infoBox: false, selectionIndicator: true, terrainProvider: new Cesium.EllipsoidTerrainProvider(), shouldAnimate: false,
    skyBox: false, skyAtmosphere: false
  });
  viewer.scene.globe.depthTestAgainstTerrain = false;
  viewer.scene.globe.enableLighting = false;
  viewer.camera.setView({ destination: Cesium.Cartesian3.fromDegrees(119.2, 39.2, 1350000), orientation: { heading: 0, pitch: Cesium.Math.toRadians(-62), roll: 0 } });
  addCesiumEntities(viewer);
  const oilArea = viewer.entities.getById('oil-area');
  const initialDiffusion = diffusionSnapshot(0);
  const oilMarker = viewer.entities.add({
    id: 'sim-oil-marker',
    position: Cesium.Cartesian3.fromDegrees(initialDiffusion.center[0], initialDiffusion.center[1], 50),
    point: { pixelSize: 15, color: Cesium.Color.fromCssColorString(initialDiffusion.stroke), outlineColor: Cesium.Color.WHITE, outlineWidth: 2, disableDepthTestDistance: Number.POSITIVE_INFINITY },
    label: { text: initialDiffusion.label, font: '600 12px Noto Sans SC, sans-serif', fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.BLACK, outlineWidth: 3, style: Cesium.LabelStyle.FILL_AND_OUTLINE, showBackground: true, backgroundColor: Cesium.Color.fromCssColorString('rgba(3,16,27,.82)'), pixelOffset: new Cesium.Cartesian2(11, -11), disableDepthTestDistance: Number.POSITIVE_INFINITY },
    properties: { detail: initialDiffusion.detail }
  });
  const oilTrail = viewer.entities.add({
    id: 'sim-oil-trail',
    polyline: { positions: Cesium.Cartesian3.fromDegreesArray([initialDiffusion.center[0], initialDiffusion.center[1], initialDiffusion.center[0], initialDiffusion.center[1]]), width: 3, material: new Cesium.PolylineDashMaterialProperty({ color: Cesium.Color.fromCssColorString(initialDiffusion.trail), dashLength: 14 }) }
  });
  const setSimulationHour = (hour = 0) => {
    const snapshot = diffusionSnapshot(hour);
    if (oilArea?.polygon) {
      oilArea.polygon.hierarchy = Cesium.Cartesian3.fromDegreesArray(snapshot.polygon.flat());
      oilArea.polygon.material = Cesium.Color.fromCssColorString(snapshot.fill).withAlpha(0.15 + simulationProgress(hour) * 0.22);
      oilArea.polygon.outlineColor = Cesium.Color.fromCssColorString(snapshot.stroke);
    }
    oilMarker.position = Cesium.Cartesian3.fromDegrees(snapshot.center[0], snapshot.center[1], 50);
    oilMarker.label.text = snapshot.label;
    oilMarker.point.color = Cesium.Color.fromCssColorString(snapshot.stroke);
    oilMarker.properties.detail = snapshot.detail;
    oilTrail.polyline.positions = Cesium.Cartesian3.fromDegreesArray([initialDiffusion.center[0], initialDiffusion.center[1], snapshot.center[0], snapshot.center[1]]);
    oilTrail.polyline.material = new Cesium.PolylineDashMaterialProperty({ color: Cesium.Color.fromCssColorString(snapshot.trail), dashLength: 14 });
    viewer.scene.requestRender();
  };
  viewer.screenSpaceEventHandler.setInputAction(click => {
    const picked = viewer.scene.pick(click.position);
    const detail = picked?.id?.properties?.detail?.getValue?.(Cesium.JulianDate.now());
    if (detail) window.rescueToast?.(detail);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  setSimulationHour(window.rescueSimulationState?.hour || 0);
  setReady(TIANDITU_KEY ? 'Cesium · 天地图影像 WMTS 已接入' : 'Cesium · OSM 影像兜底');
  return {
    setSimulationHour,
    zoomIn: () => viewer.camera.zoomIn(180000), zoomOut: () => viewer.camera.zoomOut(180000),
    locate: () => viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(119.2, 39.2, 1350000), duration: .7 }),
    destroy: () => viewer.destroy()
  };
}

async function bootMap() {
  const element = document.querySelector('#map-canvas');
  if (!element) return;
  const mode = activeMode();
  try {
    runtime = mode === 'earth' ? createCesiumMap(element) : createOpenLayersMap(element, mode);
    window.rescueMapApi = runtime;
  } catch (error) {
    console.warn('[rescue-map] fallback', error);
    setFallback('真实底图加载失败，当前保留业务点位示意', mode === 'earth' ? 'Cesium 初始化失败 · OSM 兜底待配置' : '公开底图兜底');
    window.rescueMapApi = null;
  }
}

window.addEventListener('rescue:rendered', () => {
  runtime = null;
  window.rescueMapApi = null;
  bootMap();
});

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootMap, { once: true });
else bootMap();
