const MAP_CONFIG = window.RESCUE_MAP_CONFIG || {};
const TIANDITU_KEY = MAP_CONFIG.tiandituKey || '';
const TDT_SUBDOMAINS = ['0', '1', '2', '3', '4', '5', '6', '7'];
const REGION_CENTER = [119.2, 39.2];
let runtime = null;

const mapPoints = [
  { id: 'collision', lon: 119.07, lat: 39.62, label: '碰撞险情 · 一级', detail: '疑似船舶碰撞 · 渤海湾', color: '#ff6b76', size: 13 },
  { id: 'oil', lon: 119.32, lat: 38.92, label: '油膜扩散区', detail: '溢油漂移预警 · 影响面积 2.4 km²', color: '#ffbc62', size: 12 },
  { id: 'redtide', lon: 121.18, lat: 36.85, label: '赤潮疑似区', detail: '赤潮风险升高 · AI 置信度 92.6%', color: '#ffbc62', size: 12 },
  { id: 'rescue', lon: 119.45, lat: 39.30, label: '鲁救 01', detail: '专业救助船 · 预计 12 min 抵达', color: '#53d7ff', size: 11 },
  { id: 'drone', lon: 121.32, lat: 37.12, label: 'DJI M350-03', detail: '无人机 · 待命', color: '#53d7ff', size: 11 }
];

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

function labelsStyle(ol, color, label, size) {
  return new ol.style.Style({
    image: new ol.style.Circle({ radius: size / 2, fill: new ol.style.Fill({ color }), stroke: new ol.style.Stroke({ color: '#e7ffff', width: 1.5 }) }),
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
  const points = mapPoints.map(item => {
    const feature = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.fromLonLat([item.lon, item.lat])), rescueId: item.id, detail: item.detail });
    feature.setStyle(labelsStyle(ol, item.color, item.label, item.size));
    return feature;
  });
  const oilArea = new ol.Feature({ geometry: new ol.geom.Polygon([[ol.proj.fromLonLat([119.12, 39.06]), ol.proj.fromLonLat([119.42, 39.05]), ol.proj.fromLonLat([119.58, 38.83]), ol.proj.fromLonLat([119.27, 38.76]), ol.proj.fromLonLat([119.12, 39.06])]]) });
  oilArea.setStyle(new ol.style.Style({ fill: new ol.style.Fill({ color: 'rgba(255,165,84,.20)' }), stroke: new ol.style.Stroke({ color: '#ffbc62', width: 2, lineDash: [7, 5] }) }));
  const route = new ol.Feature({ geometry: new ol.geom.LineString([ol.proj.fromLonLat([119.43, 39.29]), ol.proj.fromLonLat([119.25, 39.03]), ol.proj.fromLonLat([119.09, 38.91])]) });
  route.setStyle(new ol.style.Style({ stroke: new ol.style.Stroke({ color: '#53d7ff', width: 2.5, lineDash: [10, 7] }) }));
  vectorSource.addFeatures([oilArea, route, ...points]);
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
  setReady(useTdt ? (mode === 'satellite' ? '天地图卫星 · WMTS 已接入' : '天地图路网 · WMTS 已接入') : (mode === 'satellite' ? 'Esri Satellite · 天地图不可用时自动兜底' : 'OSM 路网 · 天地图不可用时自动兜底'));
  requestAnimationFrame(() => map.updateSize());
  return {
    zoomIn: () => map.getView().setZoom(Math.min((map.getView().getZoom() || 7) + 1, 16)),
    zoomOut: () => map.getView().setZoom(Math.max((map.getView().getZoom() || 7) - 1, 4)),
    locate: () => map.getView().animate({ center: ol.proj.fromLonLat(REGION_CENTER), zoom: 7.2, duration: 500 }),
    destroy: () => { map.setTarget(undefined); map.dispose(); }
  };
}

function addCesiumEntities(viewer) {
  const Cesium = window.Cesium;
  for (const item of mapPoints) {
    viewer.entities.add({
      id: `rescue-${item.id}`, position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 30),
      point: { pixelSize: item.size + 2, color: Cesium.Color.fromCssColorString(item.color), outlineColor: Cesium.Color.WHITE, outlineWidth: 2, disableDepthTestDistance: Number.POSITIVE_INFINITY },
      label: { text: item.label, font: '600 12px Noto Sans SC, sans-serif', fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.BLACK, outlineWidth: 3, style: Cesium.LabelStyle.FILL_AND_OUTLINE, showBackground: true, backgroundColor: Cesium.Color.fromCssColorString('rgba(3,16,27,.80)'), pixelOffset: new Cesium.Cartesian2(10, -10), disableDepthTestDistance: Number.POSITIVE_INFINITY },
      properties: { detail: item.detail }
    });
  }
  viewer.entities.add({ id: 'oil-area', polygon: { hierarchy: Cesium.Cartesian3.fromDegreesArray([119.12, 39.06, 119.42, 39.05, 119.58, 38.83, 119.27, 38.76, 119.12, 39.06]), material: Cesium.Color.fromCssColorString('#ffb862').withAlpha(.22), outline: true, outlineColor: Cesium.Color.fromCssColorString('#ffbc62'), outlineWidth: 2 } });
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
  viewer.screenSpaceEventHandler.setInputAction(click => {
    const picked = viewer.scene.pick(click.position);
    const detail = picked?.id?.properties?.detail?.getValue?.(Cesium.JulianDate.now());
    if (detail) window.rescueToast?.(detail);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  setReady(TIANDITU_KEY ? 'Cesium · 天地图影像 WMTS 已接入' : 'Cesium · OSM 影像兜底');
  return {
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
