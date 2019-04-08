define(['dojo/_base/declare', 'jimu/BaseWidget',
'esri/widgets/Sketch/SketchViewModel',
'esri/layers/GraphicsLayer',
'esri/Graphic',
'dojo/_base/lang',
'dojo/on'],
function(declare, BaseWidget,
  SketchViewModel, GraphicsLayer, Graphic, lang, on) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    //Please note that the widget depends on the 4.0 API

    // DevDay2019 Widget code goes here

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-DevDay2019',
    sketchViewModel: null,
    graphicsLayer: null,

    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');

      //1 Add GraphicsLayer
      this.graphicsLayer = new GraphicsLayer();
      this.sceneView.map.add(this.graphicsLayer);
      
      //2 Create a new instance of SketchViewModel.
      //Note: Change env.js the javascript api to 4.11
      this.sketchViewModel = new SketchViewModel({
        view: this.sceneView,
        layer: this.graphicsLayer,
        polygonSymbol: {
          type: "polygon-3d",
          symbolLayers: [{
            type: "fill",
            material: {
              color: [50, 205, 50, 1]
            }
          }]
        }
      });
      
      //3 listen to button Edit click event
      this.own(on(this.btnEdit, "click", lang.hitch(this, function (evt) {
        console.log("btnEdit click");
        this.deactivateButtons(this.domNode);
        if (!evt.currentTarget.classList.contains('active')) {
          evt.currentTarget.classList.add("active");
          this.sketchViewModel.create("polygon");
        } else {
          this.sketchViewModel.cancel();
        }
        console.log("btnEdit click end");
      })));
      
      //4 listen to create event, only respond when event's state changes to complete
      this.sketchViewModel.on("create", lang.hitch(this, function (event) {
        if (event.state === "complete") {
          this.sketchViewModel.update(event.graphic);
          this.deactivateButtons();
        }
      }));
      
      //------------
      //5 listen to button bntWhiteOak click event
      this.own(on(this.bntWhiteOak, "click", lang.hitch(this, function (evt) {
        console.log("bntWhiteOak click");
        this.deactivateButtons(this.domNode);
        if (!evt.currentTarget.classList.contains('active')) {
          evt.currentTarget.classList.add("active");
        }
        console.log("bntWhiteOak click end");
      })));
      
      //6 listen to SceneView click event, only respond when button bntWhiteOak is active
      this.sceneView.on("click", lang.hitch(this, function (evt) {
        console.log(evt.mapPoint);
      
        if (this.bntWhiteOak.classList.contains('active')) {
          evt.stopPropagation();
      
          var webStyleSymbol = {
            type: "web-style", // autocasts as new WebStyleSymbol()
            name: "Quercus",
            styleName: "EsriRealisticTreesStyle"
          };
      
          var pointGraphic = new Graphic({
            geometry: evt.mapPoint,
            symbol: webStyleSymbol
          });
      
          this.graphicsLayer.add(pointGraphic);
          this.deactivateButtons(this.domNode);
        }
      }));
      
      //------------
      //7 listen to button GLTF click event
      this.own(on(this.bntGLTF, "click", lang.hitch(this, function (evt) {
        console.log("bntGLTF click");
        if (!evt.currentTarget.classList.contains('active')) {
          this.sketchViewModel.pointSymbol = {
            type: "point-3d",
            symbolLayers: [{
              type: "object",
              resource: {
                href: "./images/daytrip.glb"
              }
            }]
          };
          this.sketchViewModel.create("point");
          evt.currentTarget.classList.add("active");
        } else {
          evt.currentTarget.classList.remove("active");
        }
        console.log("bntGLTF click end");
      })));
      
      //END.
    },

    deactivateButtons: function (node) {
      let elements = Array.prototype.slice.call(
        document.getElementsByClassName("action-button")
      );
      elements.forEach(function (element) {
        element.classList.remove("active");
      });
    },

    onOpen: function(){
      console.log('onOpen');
    },

    onClose: function(){
      console.log('onClose');
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    }
  });
});