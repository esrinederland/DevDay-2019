define(["require", "exports", "esri/WebScene", "esri/views/SceneView", "esri/layers/GeoJSONLayer", "esri/renderers", "esri/symbols", "esri/renderers/visualVariables/SizeVariable", "esri/renderers/visualVariables/ColorVariable", "esri/widgets/Expand", "esri/widgets/Zoom", "esri/widgets/Home", "../widgets/Banner", "../widgets/Slider", "../widgets/IconButton", "esri/Camera"], function (require, exports, WebScene, SceneView, GeoJSONLayer, renderers_1, symbols_1, SizeVariable, ColorVariable, Expand, Zoom, Home, Banner_1, Slider_1, IconButton_1, Camera) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var layer = new GeoJSONLayer({
        url: "http://localhost/aardbevingen/Aardbevingen.geojson",
        title: "Aardbevingen Nederland",
        copyright: "KNMI",
        definitionExpression: "magnitude > 0",
        popupTemplate: {
            content: "\n      Aardbeving van magnitude {magnitude} op {date}."
        },
        fields: [
            { "name": "magnitude", "type": "double" },
            { "name": "date", "type": "date" },
            { "name": "depth", "type": "double" }
        ],
        elevationInfo: { mode: "on-the-ground" },
        renderer: new renderers_1.SimpleRenderer({
            symbol: new symbols_1.PictureMarkerSymbol({
                url: "./src/2_geojson/Mag4.png",
                width: "32px",
                height: "32px"
            })
        })
    });
    var scene = new WebScene({
        basemap: { portalItem: { id: "39858979a6ba4cfd96005bbe9bd4cf82" } },
        ground: "world-elevation"
    });
    var view = new SceneView({
        container: "viewDiv",
        map: scene,
        qualityProfile: "high",
        camera: {
            position: {
                x: 6.1,
                y: 49,
                z: 1012385,
                spatialReference: { wkid: 4326 }
            },
            heading: 7.55,
            tilt: 14.93
        },
        environment: {
            background: {
                type: "color",
                color: "black"
            },
            starsEnabled: false,
            atmosphereEnabled: false
        },
        ui: {
            padding: {
                top: 80
            },
            components: ["attribution"]
        },
    });
    window.view = view;
    var zoom = new Zoom({ view: view, layout: "horizontal" });
    var home = new Home({ view: view });
    var alaska = new IconButton_1.default({ title: "LI", action: function () {
            var camera = new Camera({
                "position": {
                    "spatialReference": {
                        "wkid": 4326
                    },
                    "x": 4.5,
                    "y": 51.8,
                    "z": 50000
                },
                "heading": 135,
                "tilt": 70
            });
            view.goTo(camera, {
                duration: 3000
            });
        } });
    var quakeBookmark = new IconButton_1.default({
        title: "Ondergrond", action: function () {
            scene.ground.navigationConstraint = {
                type: "none"
            };
            var camera = new Camera({
                "position": {
                    "spatialReference": {
                        "wkid": 4326
                    },
                    "x": 4.7,
                    "y": 51.8,
                    "z": -3000
                },
                "heading": 135,
                "tilt": 87
            });
            view.goTo(camera, {
                duration: 3000
            });
        }
    });
    view.ui.add(zoom, "bottom-right");
    view.ui.add(home, "bottom-right");
    view.ui.add(quakeBookmark, "bottom-right");
    view.ui.add(alaska, "bottom-right");
    view.ui.add(new Banner_1.default({ title: "GeoJSON" }));
    var $ = document.querySelector.bind(document);
    var expand1 = new Expand({
        expandIconClass: "esri-icon-feature-layer",
        expandTooltip: "Layer",
        content: $("#layerPanel"),
        expanded: false,
        group: "group1",
        view: view
    });
    var expand2 = new Expand({
        expandIconClass: "esri-icon-globe",
        expandTooltip: "Elevation",
        content: $("#elevationPanel"),
        expanded: false,
        group: "group1",
        view: view
    });
    var expand3 = new Expand({
        expandIconClass: "esri-icon-maps",
        expandTooltip: "Renderer",
        content: $("#rendererPanel"),
        expanded: false,
        group: "group1",
        view: view
    });
    view.ui.add(expand1, "top-left");
    view.ui.add(expand2, "top-left");
    view.ui.add(expand3, "top-left");
    var opacitySliderDiv = $("#opacitySlider");
    $("#addGeoJSONLayerButton").onclick = function () {
        scene.add(layer);
        expand1.collapse();
    };
    $("#applyElevationInfoButton").onclick = function () {
        layer.elevationInfo = {
            mode: "absolute-height",
            unit: "meters",
            featureExpressionInfo: {
                expression: "$feature.depth * -1"
            }
        };
    };
    new Slider_1.default({
        container: opacitySliderDiv,
        min: 0,
        max: 1,
        step: 0.01,
        value: 1,
        // title: "Ground opacity",
        action: function (value) {
            $("#groundOpacityCode").innerText = "scene.ground.opacity = " + value;
            scene.ground.opacity = value;
        }
    });
    $("#applyRendererButton").onclick = function () {
        expand3.collapse();
        layer.renderer = new renderers_1.SimpleRenderer({
            symbol: new symbols_1.PointSymbol3D({
                symbolLayers: [
                    new symbols_1.ObjectSymbol3DLayer({
                        resource: {
                            primitive: "sphere"
                        }
                    })
                ]
            }),
            visualVariables: [
                new ColorVariable({
                    field: "magnitude",
                    stops: [
                        {
                            value: 0.5,
                            color: "white"
                        }, {
                            value: 4,
                            color: "red"
                        }
                    ]
                }),
                new SizeVariable({
                    field: "magnitude",
                    axis: "all",
                    stops: [
                        {
                            value: 0.5,
                            size: 500
                        },
                        {
                            value: 5,
                            size: 5000
                        }
                    ]
                })
            ]
        });
    };
});
//# sourceMappingURL=application.js.map