(function () {
  'use strict';

  const state = document.getElementById('state');
  const post = (type, payload = {}) => {
    const message = JSON.stringify({ type, ...payload });
    if (window.MziziMapBridge && typeof window.MziziMapBridge.postMessage === 'function') {
      window.MziziMapBridge.postMessage(message);
    } else if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, window.location.origin);
    }
  };

  // The browser host uses postMessage; native WebViews call MziziMap methods
  // directly through the JavaScript channel bridge.
  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.origin !== window.location.origin) return;
    let command;
    try { command = typeof event.data === 'string' ? JSON.parse(event.data) : event.data; }
    catch (_) { return; }
    if (!command || command.source !== 'mziziFlutter' || typeof command.method !== 'string') return;
    const handler = window.MziziMap && window.MziziMap[command.method];
    if (typeof handler === 'function') handler.call(window.MziziMap, command.payload || {});
  });

  if (!window.Cesium) {
    state.textContent = 'Could not load the 3D map library';
    post('mapError', { message: 'CesiumJS could not be loaded.' });
    return;
  }

  const Cesium = window.Cesium;
  let initialView = { longitude: 37.9, latitude: -0.3, height: 1450000 };
  const openingView = { longitude: 20, latitude: 7, height: 17000000 };
  const viewer = new Cesium.Viewer('globe', {
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    scene3DOnly: true,
    baseLayer: false,
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity,
    contextOptions: { webgl: { alpha: false, antialias: false, powerPreference: 'low-power' } },
  });
  viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#071612');
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#143a31');
  viewer.scene.globe.enableLighting = true;
  viewer.scene.fog.enabled = true;
  viewer.scene.globe.showGroundAtmosphere = true;
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 85000;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 40000000;
  viewer.scene.screenSpaceCameraController.inertiaSpin = 0.82;
  viewer.scene.screenSpaceCameraController.inertiaTranslate = 0.82;
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(openingView.longitude, openingView.latitude, openingView.height),
    orientation: { heading: Cesium.Math.toRadians(-8), pitch: Cesium.Math.toRadians(-68), roll: 0 },
  });

  // NASA GIBS imagery is independent of OpenStreetMap. It gives the globe a
  // global natural-colour surface without requiring a client credential.
  const imagery = new Cesium.WebMapTileServiceImageryProvider({
    url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{TileMatrix}/{TileRow}/{TileCol}.jpeg',
    layer: 'BlueMarble_NextGeneration',
    style: 'default',
    format: 'image/jpeg',
    tileMatrixSetID: 'GoogleMapsCompatible_Level8',
    maximumLevel: 8,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
  });
  viewer.imageryLayers.addImageryProvider(imagery);

  let focusSource;
  let initialBoundarySource;
  let parentSource;
  let siblingSource;
  let childSource;
  let selectedId = null;
  let sceneGeneration = 0;
  let cameraGeneration = 0;
  let cinematicFlightActive = false;
  const clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  function flyToInitial(duration = 1.5) {
    cameraGeneration += 1;
    cinematicFlightActive = false;
    viewer.camera.cancelFlight();
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(initialView.longitude, initialView.latitude, initialView.height),
      orientation: { heading: 0, pitch: Cesium.Math.toRadians(-90), roll: 0 },
      duration,
    });
  }

  function flyToKenyaCinematic() {
    const generation = ++cameraGeneration;
    cinematicFlightActive = true;
    viewer.camera.cancelFlight();
    state.textContent = 'AFRICA · A LIVING ATLAS';
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(32.5, 3.5, 6900000),
      orientation: { heading: Cesium.Math.toRadians(-8), pitch: Cesium.Math.toRadians(-72), roll: 0 },
      duration: 2.3,
      complete: () => {
        if (generation !== cameraGeneration) return;
        state.textContent = 'KENYA · COUNTY GEOGRAPHY';
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(initialView.longitude, initialView.latitude, initialView.height),
          orientation: { heading: 0, pitch: Cesium.Math.toRadians(-84), roll: 0 },
          duration: 3.4,
          complete: () => {
            if (generation !== cameraGeneration) return;
            cinematicFlightActive = false;
            state.textContent = '';
            viewer.scene.requestRender();
          },
          cancel: () => {
            if (generation === cameraGeneration) {
              cinematicFlightActive = false;
              state.textContent = '';
            }
          },
        });
      },
      cancel: () => {
        if (generation === cameraGeneration) {
          cinematicFlightActive = false;
          state.textContent = '';
        }
      },
    });
  }

  function featureId(entity) {
    const properties = entity && entity.properties;
    if (!properties) return null;
    const value = properties.geography_id || properties.geo_id || properties.id;
    return value && value.getValue ? String(value.getValue(Cesium.JulianDate.now())) : null;
  }

  clickHandler.setInputAction((event) => {
    const picked = viewer.scene.pick(event.position);
    const id = picked && picked.id;
    const geographyId = featureId(id);
    const verified = id && id.properties && id.properties.boundary_verified;
    const isVerified = verified && verified.getValue
      ? verified.getValue(Cesium.JulianDate.now()) === true
      : verified === true;
    if (geographyId && isVerified) post('boundarySelected', { id: geographyId });
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  function styleChildren(source) {
    source.entities.values.forEach((entity) => {
      if (!entity.polygon) return;
      const id = featureId(entity);
      const isSelected = id && id === selectedId;
      entity.polygon.material = isSelected
        ? Cesium.Color.fromCssColorString('#f4c66b').withAlpha(0.5)
        : Cesium.Color.fromCssColorString('#69c69a').withAlpha(0.15);
      entity.polygon.outline = true;
      entity.polygon.outlineColor = isSelected
        ? Cesium.Color.fromCssColorString('#fff0bb')
        : Cesium.Color.fromCssColorString('#c8f1d6').withAlpha(0.9);
      entity.polygon.height = 1000;
      entity.polygon.extrudedHeight = isSelected ? 14000 : 1000;
      addLabel(entity, source.entities.values.length <= 80);
    });
  }

  function styleSiblings(source) {
    source.entities.values.forEach((entity) => {
      if (!entity.polygon) return;
      entity.polygon.material = Cesium.Color.fromCssColorString('#69c69a').withAlpha(0.035);
      entity.polygon.outline = true;
      entity.polygon.outlineColor = Cesium.Color.fromCssColorString('#b9dec7').withAlpha(0.6);
      entity.polygon.extrudedHeight = 0;
      addLabel(entity, source.entities.values.length <= 80);
    });
  }

  function styleInitialBoundaries(source, hiddenId = null) {
    source.entities.values.forEach((entity) => {
      if (!entity.polygon) return;
      entity.show = featureId(entity) !== hiddenId;
      entity.polygon.material = Cesium.Color.fromCssColorString('#123d32').withAlpha(0.16);
      entity.polygon.outline = true;
      entity.polygon.outlineColor = Cesium.Color.WHITE.withAlpha(0.92);
      entity.polygon.extrudedHeight = 0;
      addLabel(entity, source.entities.values.length <= 60);
    });
  }

  async function clearSources() {
    if (focusSource) viewer.dataSources.remove(focusSource, true);
    if (parentSource) viewer.dataSources.remove(parentSource, true);
    if (siblingSource) viewer.dataSources.remove(siblingSource, true);
    if (childSource) viewer.dataSources.remove(childSource, true);
    focusSource = null;
    parentSource = null;
    siblingSource = null;
    childSource = null;
  }

  async function addFeature(feature, selected, parent = false, red = false) {
    if (!feature || !feature.geometry) return null;
    const collection = { type: 'FeatureCollection', features: [feature] };
    const source = await Cesium.GeoJsonDataSource.load(collection, {
      clampToGround: false,
      stroke: selected
        ? (red ? Cesium.Color.WHITE : Cesium.Color.fromCssColorString('#fff0bb'))
        : parent
        ? Cesium.Color.fromCssColorString('#a5cfb4')
        : Cesium.Color.WHITE,
      strokeWidth: selected ? 3 : parent ? 2 : 1.5,
      fill: selected
        ? (red ? Cesium.Color.fromCssColorString('#e22620').withAlpha(0.84) : Cesium.Color.fromCssColorString('#f4c66b').withAlpha(0.28))
        : Cesium.Color.fromCssColorString('#69c69a').withAlpha(parent ? 0.015 : 0.12),
    });
    source.entities.values.forEach((entity) => {
      if (!entity.polygon) return;
      entity.polygon.extrudedHeight = selected ? (red ? 7000 : 12000) : 0;
      entity.polygon.outline = true;
      if (red) entity.polygon.outlineColor = Cesium.Color.WHITE;
      addLabel(entity, true);
    });
    viewer.dataSources.add(source);
    return source;
  }

  function addLabel(entity, enabled) {
    if (!enabled || !entity.properties) return;
    const nameProperty = entity.properties.name || entity.properties.display_name;
    const pointProperty = entity.properties.label_point;
    const name = nameProperty && nameProperty.getValue
      ? nameProperty.getValue(Cesium.JulianDate.now())
      : null;
    const point = pointProperty && pointProperty.getValue
      ? pointProperty.getValue(Cesium.JulianDate.now())
      : null;
    if (typeof name !== 'string' || !Array.isArray(point) || point.length < 2) return;
    entity.position = Cesium.Cartesian3.fromDegrees(Number(point[0]), Number(point[1]));
    entity.label = {
      text: name,
      font: '12px system-ui, sans-serif',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.fromCssColorString('#10251d'),
      outlineWidth: 3,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -7),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4500000),
      disableDepthTestDistance: 100000,
    };
  }

  window.MziziMap = {
    async configure(config) {
      const requestedView = config && config.initialView;
      if (requestedView &&
          Number.isFinite(Number(requestedView.longitude)) &&
          Number.isFinite(Number(requestedView.latitude)) &&
          Number.isFinite(Number(requestedView.height)) &&
          Math.abs(Number(requestedView.longitude)) <= 180 &&
          Math.abs(Number(requestedView.latitude)) <= 90 &&
          Number(requestedView.height) > 0) {
        initialView = {
          longitude: Number(requestedView.longitude),
          latitude: Number(requestedView.latitude),
          height: Number(requestedView.height),
        };
        const reducedMotion = window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (config && config.cinematicIntro && reducedMotion) {
          cameraGeneration += 1;
          cinematicFlightActive = false;
          viewer.camera.cancelFlight();
          viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(initialView.longitude, initialView.latitude, initialView.height),
            orientation: { heading: 0, pitch: Cesium.Math.toRadians(-90), roll: 0 },
          });
          state.textContent = '';
        } else if (config && config.cinematicIntro) {
          flyToKenyaCinematic();
        } else {
          flyToInitial(0.8);
        }
      }
      if (config && config.ionToken) {
        Cesium.Ion.defaultAccessToken = config.ionToken;
        try {
          const terrain = await Cesium.Terrain.fromWorldTerrain();
          viewer.scene.setTerrain(terrain);
        } catch (error) {
          post('mapWarning', { message: 'Terrain is unavailable; using the globe surface.' });
        }
      }
    },
    async setInitialBoundaries(payload) {
      if (!payload || !payload.boundaries) return;
      try {
        if (initialBoundarySource) viewer.dataSources.remove(initialBoundarySource, true);
        initialBoundarySource = await Cesium.GeoJsonDataSource.load(payload.boundaries, {
          clampToGround: false,
          stroke: Cesium.Color.WHITE.withAlpha(0.92),
          strokeWidth: 1.8,
          fill: Cesium.Color.fromCssColorString('#123d32').withAlpha(0.14),
        });
        viewer.dataSources.add(initialBoundarySource);
        styleInitialBoundaries(initialBoundarySource, selectedId);
        if (!cinematicFlightActive) state.textContent = '';
        viewer.scene.requestRender();
      } catch (error) {
          post('mapWarning', { message: 'Verified initial geography boundaries could not be displayed.' });
      }
    },
    async setScene(scene) {
      const generation = ++sceneGeneration;
      cameraGeneration += 1;
      cinematicFlightActive = false;
      viewer.camera.cancelFlight();
      state.textContent = scene && scene.loadingLabel ? scene.loadingLabel : '';
      selectedId = scene ? scene.selectedId : null;
      this.selectedLevel = scene ? scene.selectedLevel : '';
      if (initialBoundarySource) {
        styleInitialBoundaries(initialBoundarySource, selectedId);
      }
      await clearSources();
      if (generation !== sceneGeneration) return;
      if (!scene || !scene.focusFeature) {
        if (scene && scene.reset) {
          flyToInitial(1.6);
          state.textContent = '';
        }
        if (scene) await addSceneContext(scene, generation);
        viewer.scene.requestRender();
        return;
      }
      try {
        await addSceneContext(scene, generation);
        if (generation !== sceneGeneration) return;
        focusSource = await addFeature(scene.focusFeature, true, false, false);
        if (generation !== sceneGeneration) {
          if (focusSource) viewer.dataSources.remove(focusSource, true);
          return;
        }
        const focusIds = focusSource ? focusSource.entities.values : [];
        if (focusIds.length) {
          await viewer.flyTo(focusSource, { duration: 1.8, maximumHeight: 24000000 });
        }
        state.textContent = '';
        viewer.scene.requestRender();
      } catch (error) {
        if (generation !== sceneGeneration) return;
        state.textContent = 'Verified boundary could not be displayed';
        post('mapError', { message: `Verified boundary rendering failed: ${String(error && error.message ? error.message : error)}` });
      }
    },
    reset() {
      this.setScene({ reset: true });
    },
    zoomIn() {
      const height = viewer.camera.positionCartographic.height;
      viewer.camera.zoomIn(Math.max(height * 0.35, 100));
    },
    zoomOut() {
      const height = viewer.camera.positionCartographic.height;
      viewer.camera.zoomOut(Math.max(height * 0.4, 100));
    },
  };

  async function addSceneContext(scene, generation) {
    if (scene.parentBoundary) {
      const source = await addFeature(scene.parentBoundary, false, true);
      if (generation !== sceneGeneration) {
        if (source) viewer.dataSources.remove(source, true);
        return;
      }
      parentSource = source;
    }
    if (scene.siblingBoundaries && Array.isArray(scene.siblingBoundaries.features)) {
      const source = await Cesium.GeoJsonDataSource.load(scene.siblingBoundaries, {
        clampToGround: false,
        stroke: Cesium.Color.fromCssColorString('#b9dec7').withAlpha(0.6),
        strokeWidth: 1,
        fill: Cesium.Color.fromCssColorString('#69c69a').withAlpha(0.035),
      });
      viewer.dataSources.add(source);
      if (generation !== sceneGeneration) {
        viewer.dataSources.remove(source, true);
        return;
      }
      siblingSource = source;
      styleSiblings(source);
    }
    if (scene.childBoundaries && Array.isArray(scene.childBoundaries.features)) {
      const source = await Cesium.GeoJsonDataSource.load(scene.childBoundaries, {
        clampToGround: false,
        stroke: Cesium.Color.fromCssColorString('#c8f1d6').withAlpha(0.9),
        strokeWidth: 1.35,
        fill: Cesium.Color.fromCssColorString('#69c69a').withAlpha(0.12),
      });
      viewer.dataSources.add(source);
      if (generation !== sceneGeneration) {
        viewer.dataSources.remove(source, true);
        return;
      }
      childSource = source;
      styleChildren(source);
    }
    if (!scene.focusFeature) {
      const framingSource = childSource || siblingSource || parentSource;
      if (framingSource && generation === sceneGeneration) {
        await viewer.flyTo(framingSource, { duration: 1.5, maximumHeight: 24000000 });
      }
    }
  }

  imagery.errorEvent.addEventListener(() => {
    if (!focusSource && !childSource) state.textContent = 'Imagery is unavailable; interactive globe remains available';
  });

  setTimeout(() => {
    state.textContent = '';
    post('mapReady');
  }, 0);
})();
