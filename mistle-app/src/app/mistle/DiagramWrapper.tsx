import * as go from "gojs";
import { ReactDiagram, ReactPalette } from "gojs-react";
import * as React from "react";
import { saveAs } from "file-saver";
import "./extensions/Figures.ts";
import "./extensions/Arrowheads.ts";
import RescalingTool from "./extensions/RescalingTool";
import DrawCommandHandler from "./extensions/DrawCommandHandler";
import GuidedDraggingTool from "./extensions/GuidedDraggingTool";
import LinkLabelDraggingTool from "./extensions/LinkLabelDraggingTool";
import LinkShiftingTool from "./extensions/LinkShiftingTool";
import "./DiagramWrapper.css";
import HeaderAvatar from "@/components/ui/headerAvatar";
import Topleftbar from "./components/topleftbar";
import Leftbar from "./components/leftbar";
import Settings from "./components/settings";
import { toast } from "sonner";
import TextStyles from "./components/TextStyles";

interface DiagramProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

const DiagramWrapper: React.FC<DiagramProps> = (props) => {
  const diagramRef = React.useRef<ReactDiagram>(null);
  const [grid, setGrid] = React.useState(false);
  const [guide, setGuide] = React.useState(true);
  const [fscreen, setFscreen] = React.useState(false);
  const [pallete, setPallete] = React.useState(false);
  const [textStyles, setTextStyles] = React.useState(false);
  const [linkType, setLinkType] = React.useState(false);
  const linkChoiceRef = React.useRef(linkType);
  const [diagramName, setDiagramName] = React.useState("");
  const [format, setFormat] = React.useState("");
  const [backgroundColor, setBackgroundColor] = React.useState("");
  const [theme, setTheme] = React.useState(true);
  const diagramStyle = { backgroundColor: theme ? "#1a1a1a" : "#d9d9d9" };
  const [loading, setLoading] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("option1");

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const toggleGrid = () => {
    setGrid((prevGrid) => {
      const newGrid = !prevGrid;
      localStorage.setItem("grid", JSON.stringify(newGrid));
      return newGrid;
    });
  };

  const handleToggleGuides = () => {
    setGuide((prevGuide) => !prevGuide);
    if (!guide) {
      toast.info("Nodes Alignment Guides are Enabled");
    } else {
      toast.warning("Nodes Alignment Guides are Disabled");
    }
  };

  const handleThemeChanges = () => {
    setTheme((prevTheme) => {
      const newTheme = !prevTheme;
      localStorage.setItem("theme", JSON.stringify(newTheme));
      changeGridStroke(
        diagramRef.current?.getDiagram(),
        theme ? "#b3b3b3" : "#000000"
      );
      return newTheme;
    });
  };

  const togglePalette = () => {
    setPallete((prevPallete: any) => !prevPallete);
    setTextStyles(false);
  };

  const toggleTextStyles = () => {
    setTextStyles((prevTextStyles) => !prevTextStyles);
    setPallete(false);
  };

  React.useEffect(() => {
    // Load diagram name from sessionStorage on component mount
    const savedDiagramName = sessionStorage.getItem("diagramName");
    const savedGrid = localStorage.getItem("grid");
    const savedGuides = localStorage.getItem("guides");
    const savedTheme = localStorage.getItem("theme");
    if (savedDiagramName) {
      setDiagramName(savedDiagramName);
    }
    if (savedGrid !== null) {
      setGrid(JSON.parse(savedGrid));
    }
    if (savedTheme !== null) {
      const isTheme = JSON.parse(savedTheme);
      setTheme(isTheme);
      changeGridStroke(
        diagramRef.current?.getDiagram(),
        isTheme ? "#000000" : "#b3b3b3"
      );
    }
    document.title = "Mistle App";
  }, []);

  React.useEffect(() => {
    linkChoiceRef.current = linkType;
  }, [linkType]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const handleNameChange = (e: any) => {
    const newName = e.target.value;
    setDiagramName(newName);
    // Save diagram name to sessionStorage
    sessionStorage.setItem("diagramName", newName);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.target.blur(); // Remove focus from the input field
    }
  };

  const colors = {
    red: "#ff3333",
    blue: "#3358ff",
    green: "#25ad23",
    magenta: "#d533ff",
    purple: "#7d33ff",
    orange: "#ff6233",
    brown: "#8e571e",
    white: "#ffffff",
    black: "#000000",
    beige: "#fffcd5",
    extralightblue: "#d5ebff",
    extralightred: "#f2dfe0",
    lightblue: "#a5d2fa",
    lightgray: "#cccccc",
    lightgreen: "#b3e6b3",
    lightred: "#fcbbbd",
  };

  let nodeDataArray: any, linkDataArray: any;
  switch (selectedOption) {
    case "option1":
      nodeDataArray = [
        {
          key: "0",
          fill: "white",
          text: "Start",
          shape: "Start",
          size: "80 49.66259747882222",
        },
        {
          key: "1",
          fill: "white",
          text: "Yes/No",
          shape: "Decision",
          size: "160 67.58373413085937",
        },
        {
          key: "2",
          fill: "white",
          text: "Process",
          shape: "Process",
          size: "100 44.791867065429685",
        },
        {
          key: "3",
          fill: "white",
          text: "Input",
          shape: "Input",
          size: "90.607383731972 44.791867065429685",
        },
      ];
      linkDataArray = [];
      break;
    case "option2":
      nodeDataArray = [
        {
          key: "0",
          text: "",
          fill: "white",
          shape: "Start",
          size: "60 60",
        },
        {
          key: "1",
          fill: "white",
          text: "State-Box",
          shape: "State Box",
          size: "103.83214315260481 40.314714563737624",
        },
        {
          key: "2",
          fill: "white",
          text: "Condition",
          shape: "Guard",
          size: "200 71.80454081282777",
        },
        { key: "3", fill: "white", text: "", shape: "EndState", size: "60 60" },
        {
          key: "4",
          fill: "white",
          text: "",
          shape: "Time Event",
          size: "50 73.16746826171874",
        },
        {
          key: "5",
          fill: "white",
          text: "",
          shape: "Flow Final",
          size: "42 40",
        },
        { key: "6", fill: "white", text: "", shape: "Fork", size: "140 20" },
      ];
      linkDataArray = [];

      break;
    case "option3":
      nodeDataArray = [
        {
          key: "0",
          fill: "white",
          text: "Block",
          shape: "Block",
          size: "80 49.66259747882222",
        },
      ];
      linkDataArray = [];

      break;
    case "option4":
      nodeDataArray = [
        {
          key: "0",
          fill: "white",
          text: "",
          shape: "Actor",
          size: "50 74.87081570095485",
        },
        {
          key: "1",
          fill: "white",
          text: ":Object",
          shape: "Object",
          size: "80 37.19814475843685",
        },
      ];
      linkDataArray = [
        // the Palette also has a disconnected Link, which the user can drag-and-drop
        {
          points: new go.List(/*go.Point*/).addAll([
            new go.Point(20, 20),
            new go.Point(50, 60),
          ]),
          routing: go.Routing.Normal,
        },
      ];

      break;
    case "option5":
      nodeDataArray = [
        {
          key: "0",
          fill: "white",
          text: "Strong Entity",
          shape: "Strong Entity",
          size: "143.92176818847656 90",
          scale: 0.7441059662527992,
        },
        {
          key: "1",
          fill: "white",
          text: "Weak Entity",
          shape: "Weak Entity",
          size: "146.08428955078125 90",
          scale: 0.7542677487462591,
        },
        {
          key: "2",
          fill: "white",
          text: "Associative \nEntity",
          shape: "Associative Entity",
          size: "256.27837057505906 114.79186706542973",
          scale: 0.5862092019808233,
        },
        {
          key: "3",
          fill: "white",
          text: "Relationship",
          shape: "Decision",
          size: "252.43566135141995 124.79186706542968",
          scale: 0.5882737953386574,
        },
        {
          key: "4",
          fill: "white",
          text: "Weak \nRelationship",
          shape: "Weak Relationship",
          size: "252.43566135141995 124.79186706542968",
          scale: 0.5882737953386574,
        },
        {
          key: "5",
          fill: "white",
          text: "Attribute",
          shape: "Start",
          size: "128.3261070068564 79.66259747882222",
          scale: 0.753806446400175,
        },
        {
          key: "6",
          fill: "white",
          text: "Multivalued \nAttribute",
          shape: "Multivalued",
          size: "170 99.66259747882222",
          scale: 0.753806446400175,
        },
      ];
      linkDataArray = [];

      break;
    default:
      nodeDataArray = [];
  }

  function toggleGuidedDraggingTool() {
    const diagram: any = diagramRef.current?.getDiagram();
    var tool = diagram?.toolManager.draggingTool;
    if (tool instanceof GuidedDraggingTool) {
      diagram.toolManager.draggingTool = new go.DraggingTool();
      diagram.toolManager.draggingTool.dragsLink = true;
    } else {
      diagram.toolManager.draggingTool = new GuidedDraggingTool();
      diagram.toolManager.draggingTool.horizontalGuidelineColor = "dodgerblue";
      diagram.toolManager.draggingTool.verticalGuidelineColor = "dodgerblue";
      diagram.toolManager.draggingTool.centerGuidelineColor = "indianred";
      diagram.toolManager.draggingTool.guidelineWidth = 1;
      diagram.toolManager.draggingTool.dragsLink = true;
    }
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      setFscreen(true);
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      setFscreen(false);
      document.exitFullscreen();
    }
  };

  // Local Storage Implementation

  const saveDiagramToLocalStorage = () => {
    const diagram = diagramRef.current?.getDiagram();
    if (diagram) {
      const jsonData = diagram.model.toJson();
      const parsedData = JSON.parse(jsonData);
      const extractedNodeData = JSON.stringify(parsedData.nodeDataArray);
      const extractedLinkData = JSON.stringify(parsedData.linkDataArray);
      const extractedJsonData = `"nodeDataArray": ${extractedNodeData}, "linkDataArray": ${extractedLinkData}, "modelData": {"canRelink": true}, "selectedData": null, "skipsDiagramUpdate": false`;
      localStorage.setItem("diagramData", `{${extractedJsonData}}`);
    }
  };

  // Save diagram data to local storage when the user leaves the webpage
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      saveDiagramToLocalStorage();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  React.useEffect(() => {
    const diagram = diagramRef.current?.getDiagram();

    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener("ChangedSelection", props.onDiagramEvent);
    }

    return () => {
      if (diagram instanceof go.Diagram) {
        diagram.removeDiagramListener("ChangedSelection", props.onDiagramEvent);
      }
    };
  }, [props.onDiagramEvent]);

  React.useEffect(() => {
    const diagram = diagramRef.current?.getDiagram();

    if (diagram instanceof go.Diagram) {
      diagram.grid.visible = grid;
      diagram.toolManager.draggingTool.isGridSnapEnabled = grid;
      diagram.toolManager.resizingTool.isGridSnapEnabled = grid;
      diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(5, 5);
    }
  }, [grid]);

  const initDiagram = (): go.Diagram => {
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, {
      draggingTool: new GuidedDraggingTool(), // defined in GuidedDraggingTool.js
      "draggingTool.horizontalGuidelineColor": "dodgerblue",
      "draggingTool.verticalGuidelineColor": "dodgerblue",
      "draggingTool.centerGuidelineColor": "indianred",
      "draggingTool.guidelineWidth": 1,
      "draggingTool.dragsLink": true,
      "linkingTool.isUnconnectedLinkValid": true,
      "linkingTool.portGravity": 15,
      "relinkingTool.isUnconnectedLinkValid": true,
      "relinkingTool.portGravity": 15,
      "relinkingTool.fromHandleArchetype": $(go.Shape, "Square", {
        segmentIndex: 0,
        cursor: "pointer",
        desiredSize: new go.Size(8, 8),
        fill: "white",
        stroke: "black",
      }),
      "relinkingTool.toHandleArchetype": $(go.Shape, "Square", {
        segmentIndex: -1,
        cursor: "pointer",
        desiredSize: new go.Size(8, 8),
        fill: "white",
        stroke: "black",
      }),
      "linkReshapingTool.handleArchetype": $(go.Shape, "Square", {
        desiredSize: new go.Size(5, 5),
        fill: "lightblue",
        stroke: "deepskyblue",
      }),
      //  "rotatingTool.snapAngleMultiple": 90,
      "rotatingTool.snapAngleEpsilon": 45, // RotationTool Configurations
      "rotatingTool.handleDistance": 20,
      "undoManager.isEnabled": true,
      commandHandler: $(DrawCommandHandler), // defined in DrawCommandHandler.js
      "toolManager.mouseWheelBehavior": go.WheelMode.Zoom,
      "clickCreatingTool.archetypeNodeData": {
        text: "New Node",
        fill: "white",
        stroke: "black",
        strokeWidth: "2",
      },
      "commandHandler.archetypeGroupData": {
        text: "Name This Group",
        isGroup: true,
        // color: "dodgerblue",
      },
      "animationManager.isInitial": false, // To use custom initial animation instead
      InitialLayoutCompleted: animateFadeIn,
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key",
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        makeUniqueKeyFunction: (m: go.Model, data: any) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          data.key = k;
          return k;
        },
        makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
          let k = data.key || -1;
          while (m.findLinkDataForKey(k)) k--;
          data.key = k;
          return k;
        },
      }),
    });

    function CMButton(options: any) {
      return $(
        go.Shape,
        {
          fill: "#4657C7",
          stroke: "rgba(0, 0, 0, 0)",
          strokeWidth: 15,
          maxSize: new go.Size(16, 5),
          background: "transparent",
          geometryString:
            "F1 M0 0 b 0 360 -4 0 4 z M10 0 b 0 360 -4 0 4 z M20 0 b 0 360 -4 0 4", // M10 0 A2 2 0 1 0 14 10 M20 0 A2 2 0 1 0 24 10,
          isActionable: true,
          cursor: "context-menu",
          mouseEnter: (e: any, shape: any) => (shape.fill = "dodgerblue"),
          mouseLeave: (e: any, shape: any) => (shape.fill = "#4657C7"),
          click: (e: any, shape: any) => {
            e.diagram.commandHandler.showContextMenu(shape.part.adornedPart);
          },
        },
        options || {}
      );
    }

    function animateFadeIn(e: any) {
      var diagram = e.diagram;
      var animation = new go.Animation();
      animation.isViewportUnconstrained = true;
      animation.easing = go.Animation.EaseOutExpo; // Looks better for a fade in animation
      animation.duration = 900;
      animation.add(
        diagram,
        "position",
        diagram.position
          .copy()
          .offset(0, diagram instanceof go.Palette ? 200 : -200),
        diagram.position
      );
      animation.add(diagram, "opacity", 0, 1);
      animation.start();
    }

    go.AnimationManager.defineAnimationEffect(
      "bounceDelete",
      (
        obj: any,
        startValue,
        endValue,
        easing,
        currentTime,
        duration,
        animation
      ) => {
        var animationState = animation.getTemporaryState(obj);
        if (animationState.initial === undefined) {
          // Set the initial positions as part of the animationState data
          animationState.yPos = obj.location.y;
          animationState.xPos = obj.location.x;
          animationState.yVelo = 0;
          animationState.xVelo = 0;
          animationState.newTime = 0;
          animationState.oldTime = 0;
          animationState.initial = true;
        }
        obj.location = getPointBounceDelete(
          currentTime,
          obj,
          animationState,
          obj.diagram
        );
      }
    );

    // Get the point the object should be at based upon the time and original point
    function getPointBounceDelete(
      currentTime: any,
      obj: any,
      animationState: any,
      diagram: any
    ) {
      if (diagram === null)
        return new go.Point(animationState.xPos, animationState.yPos);
      let height = obj.actualBounds.height;
      animationState.newTime = currentTime;
      // Animation uses a change in time in order to be more consistant
      let delTime = (animationState.newTime - animationState.oldTime) / 3;
      animationState.yVelo += 0.05 * delTime;
      // Add a slight easing to the x movement at the beginning of the animation
      if (currentTime < 200) {
        animationState.xVelo = currentTime / 300;
      }
      // Adjust positions based on the velocities and the change in time
      animationState.yPos += animationState.yVelo * delTime;
      animationState.xPos += animationState.xVelo * delTime;

      if (animationState.yPos > diagram.viewportBounds.height / 2 - height) {
        animationState.yVelo = -0.75 * animationState.yVelo;
        animationState.yPos = diagram.viewportBounds.height / 2 - height;
      }
      let myPoint = new go.Point(animationState.xPos, animationState.yPos);
      // Get the new old time for use in the next iteration
      animationState.oldTime = animationState.newTime;
      return myPoint;
    }

    diagram.addDiagramListener("SelectionDeleting", (e) => {
      var animation = new go.Animation();
      var diagram = e.diagram;
      e.subject.each((p: any) => {
        var part = p.copy();
        animation.addTemporaryPart(part, diagram);
        var initPosition = part.position.copy();
        part.locationSpot = go.Spot.Center;
        part.position = initPosition;
        animation.duration = 220;
        animation.add(part, "scale", part.scale, 0.01);
      });
      animation.start();
    });

    diagram.addDiagramListener("ClipboardPasted", (e) => {
      var animation = new go.Animation();
      e.subject.each((part: any) => {
        addCreatedPart(part, animation);
      });
      animation.start();
    });

    diagram.addDiagramListener("PartCreated", (e) => {
      changeColor(e.diagram, colors.black, "color");
      // From ClickCreatingTool
      var animation = new go.Animation();
      addCreatedPart(e.subject, animation);
      animation.start();
    });

    diagram.addDiagramListener("ExternalObjectsDropped", (e) => {
      // Check if the dropped object is a link
      if (e.diagram.selection.first() instanceof go.Link) {
        changeColor(e.diagram, "#595959", "color");
      } else {
        changeColor(e.diagram, colors.black, "color");
      }
    });

    diagram.addDiagramListener("LinkDrawn", (e) => {
      var link = e.subject;
      if (linkChoiceRef.current) {
        link.routing = go.Routing.Normal;
      } else {
        link.routing = go.Routing.AvoidsNodes;
      }
      changeColor(e.diagram, "#595959", "color");
    });

    diagram.addDiagramListener("SelectionGrouped", (e) => {
      changeColor(e.diagram, "white", "color");
      changeColor(e.diagram, "rgba(128,128,128,0.2)", "fill");
    });

    function addCreatedPart(part: any, animation: any) {
      animation.add(part, "scale", 0.01, part.scale);
      animation.duration = 160;
    }

    function makePort(name: any, spot: any, output: any, input: any) {
      // the port is basically just a small transparent circle
      return $(go.Shape, "Circle", {
        fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
        stroke: null,
        desiredSize: new go.Size(8, 8),
        alignment: spot, // align the port on the main Shape
        alignmentFocus: spot, // just inside the Shape
        portId: name, // declare this object to be a "port"
        fromSpot: spot,
        toSpot: spot, // declare where links may connect at this port
        fromLinkable: output,
        toLinkable: input, // declare whether the user may draw links to/from here
        cursor: "pointer", // show a different cursor to indicate potential link point
      });
    }

    const tempfromnode = $(
      // Temporary node outline styles
      go.Node,
      { layerName: "Tool" },
      $(go.Shape, "RoundedRectangle", {
        stroke: "indianred",
        strokeWidth: 3,
        fill: null,
        portId: "",
        width: 1,
        height: 1,
      })
    );

    const temptonode = $(
      go.Node,
      { layerName: "Tool" },
      $(go.Shape, "RoundedRectangle", {
        stroke: "dodgerblue",
        strokeWidth: 3,
        fill: null,
        portId: "",
        width: 1,
        height: 1,
      })
    );

    diagram.toolManager.linkingTool.temporaryLink = $(
      // Temporary node linking style
      go.Link,
      { layerName: "Tool" },
      $(go.Shape, {
        stroke: "dodgerblue",
        strokeWidth: 2,
        strokeDashArray: [4, 2],
      })
    );

    diagram.toolManager.relinkingTool.temporaryLink = $(
      // Temporary node relinking style
      go.Link,
      { layerName: "Tool" },
      $(go.Shape, {
        stroke: "dodgerblue",
        strokeWidth: 2,
        strokeDashArray: [4, 2],
      })
    );

    diagram.toolManager.mouseMoveTools.insertAt(0, new LinkLabelDraggingTool());
    diagram.toolManager.linkingTool.temporaryFromNode = tempfromnode;
    diagram.toolManager.linkingTool.temporaryFromPort = tempfromnode.port;
    diagram.toolManager.linkingTool.temporaryToNode = temptonode;
    diagram.toolManager.linkingTool.temporaryToPort = temptonode.port;
    diagram.scrollMode = go.ScrollMode.Infinite;
    diagram.grid = $(
      go.Panel,
      "Grid",
      {
        name: "GRID",
        visible: grid, //We'll use button to set this to true/false dynamically
        gridCellSize: new go.Size(10, 10),
        gridOrigin: new go.Point(0, 0),
      },
      $(go.Shape, "LineH", {
        strokeWidth: 0.5,
        interval: 1,
      }),
      $(go.Shape, "LineH", {
        strokeWidth: 0.5,
        interval: 5,
      }),
      $(go.Shape, "LineH", {
        strokeWidth: 1.0,
        interval: 10,
      }),
      $(go.Shape, "LineV", {
        strokeWidth: 0.5,
        interval: 1,
      }),
      $(go.Shape, "LineV", {
        strokeWidth: 0.5,
        interval: 5,
      }),
      $(go.Shape, "LineV", {
        strokeWidth: 1.0,
        interval: 10,
      })
    );

    diagram.toolManager.draggingTool.isGridSnapEnabled = grid;
    diagram.toolManager.resizingTool.isGridSnapEnabled = grid;
    diagram.toolManager.mouseDownTools.add(new RescalingTool());
    diagram.toolManager.mouseDownTools.add($(LinkShiftingTool));

    diagram.nodeTemplate = $(
      go.Node,
      "Spot",
      {
        minSize: new go.Size(30, 20),
        locationSpot: go.Spot.Center,
        rotatable: true,
        resizable: true,
        rotationSpot: go.Spot.Center,
        rotateAdornmentTemplate: $(
          go.Adornment, // the rotation handle custom adornment
          { locationSpot: go.Spot.Bottom },
          $(go.Shape, "BpmnActivityLoop", {
            width: 12,
            height: 12,
            cursor: "pointer",
            background: "transparent",
            stroke: "dodgerblue",
            strokeWidth: 2,
          })
        ),
        selectionObjectName: "SHAPE",
        doubleClick: (e: any, node: any) => {
          e.diagram.model.commit((m: any) => {
            if (!node.data.text || /^\s*$/.test(node.data.text)) {
              m.set(node.data, "text", "AddText");
            }
          });
        },
      },
      new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
        go.Size.stringify
      ),
      new go.Binding("angle").makeTwoWay(), // Binding for rotation
      new go.Binding("scale").makeTwoWay(), // Binding for scaling
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(
        go.Panel,
        "Auto",
        $(
          go.Shape,
          "RoundedRectangle",
          {
            name: "SHAPE",
            fill: colors.white,
            stroke: "black",
            strokeWidth: 2,
            portId: "",
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,
            fromLinkable: true,
            toLinkable: true,
            fromLinkableSelfNode: true,
            toLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkableDuplicates: true,
            cursor: "pointer",
          },
          new go.Binding("fill"),
          new go.Binding("stroke", "color"),
          new go.Binding("strokeWidth", "thickness"),
          new go.Binding("strokeDashArray", "dash"),
          new go.Binding("figure", "shape", (shape) => {
            // Map the shape property to the corresponding figure property for the flowchart shape
            switch (shape) {
              case "Start":
                return "Ellipse";
              case "Process":
                return "Rectangle";
              case "Decision":
                return "Diamond";
              case "Input":
                return "Input";
              case "Initial State":
                return "Circle";
              case "State Box":
                return "RoundedRectangle";
              case "EndState":
                return "EndState";
              case "Guard":
                return "Diamond";
              case "Actor":
                return "Actor";
              case "Object":
                return "Rectangle";
              case "Time Event":
                return "Collate";
              case "Flow Final":
                return "Junction";
              case "Fork":
                return "RoundedRectangle";
              case "File":
                return "File";
              case "Strong Entity":
                return "Rectangle";
              case "Weak Entity":
                return "WeakEntity";
              case "Associative Entity":
                return "AssociativeEntity";
              case "Weak Relationship":
                return "WeakRelationship";
              case "Multivalued":
                return "Multivalued";
              // Add more shape mappings as needed
              default:
                return "RoundedRectangle"; // Default to RoundedRectangle if shape is not recognized
            }
          })
          //  new go.Binding("fill", "color")
        ),
        $(go.Shape, {
          width: 40,
          height: 25,
          strokeWidth: 0,
          fill: "transparent",
        }),
        $(
          go.TextBlock,
          {
            textAlign: "center",
            isMultiline: true,
            overflow: go.TextOverflow.Ellipsis,
            margin: 6,
            editable: true,
            isUnderline: false,
            font: "400 1.2rem Arial, sans-serif",
            stroke: "black",
          },
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("stroke", "color"),
          new go.Binding("font", "fontType"),
          new go.Binding("isUnderline", "setUnderline")
        )
      ),
      makePort("T", go.Spot.Top, true, true),
      makePort("L", go.Spot.Left, true, true),
      makePort("R", go.Spot.Right, true, true),
      makePort("B", go.Spot.Bottom, true, true),
      {
        // handle mouse enter/leave events to show/hide the ports
        mouseEnter: (e, node: any) => {
          showSmallPorts(node, true);
        },
        mouseLeave: (e, node: any) => {
          showSmallPorts(node, false);
        },
      }
    );

    function showSmallPorts(node: go.Node, show: boolean) {
      node.ports.each((port: any) => {
        if (port.portId !== "") {
          // don't change the default port, which is the big shape
          port.fill = show ? "#c0a7fc" : null;
          port.stroke = show ? "#9064f5" : null;
        }
      });
    }

    function showGroupPorts(group: go.Group, show: boolean) {
      group.ports.each((port: any) => {
        if (port.portId !== "") {
          port.fill = show ? "#c0a7fc" : null;
          port.stroke = show ? "#9064f5" : null;
        }
      });
    }

    diagram.nodeTemplate.selectionAdornmentTemplate = $(
      go.Adornment,
      "Spot",
      $(
        go.Panel,
        "Auto",
        $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
        $(go.Placeholder, { margin: 1.5 })
      ),
      CMButton({
        alignment: go.Spot.TopRight,
        alignmentFocus: go.Spot.BottomRight,
      })
    );

    function ClickFunction(propname: any, value: any) {
      return (e: any, obj: any) => {
        e.handled = true; // don't let the click bubble up
        e.diagram.model.commit((m: any) => {
          m.set(obj.part.adornedPart.data, propname, value);
        });
      };
    }

    // Create a context menu button for setting a data property with a color value.
    function ColorButton(color: any, propname: any) {
      if (!propname) propname = "color";
      return $(go.Shape, {
        width: 16,
        height: 16,
        stroke: "lightgray",
        fill: color,
        margin: 1,
        background: "transparent",
        mouseEnter: (e: any, shape: any) => (shape.stroke = "dodgerblue"),
        mouseLeave: (e: any, shape: any) => (shape.stroke = "lightgray"),
        click: ClickFunction(propname, color),
        contextClick: ClickFunction(propname, color),
      });
    }

    function LightFillButtons() {
      // used by multiple context menus
      return [
        $(
          "ContextMenuButton",
          $(
            go.Panel,
            "Horizontal",
            ColorButton(colors.white, "fill"),
            ColorButton(colors.beige, "fill"),
            ColorButton(colors.extralightblue, "fill"),
            ColorButton(colors.extralightred, "fill")
          )
        ),
        $(
          "ContextMenuButton",
          $(
            go.Panel,
            "Horizontal",
            ColorButton(colors.lightgray, "fill"),
            ColorButton(colors.lightgreen, "fill"),
            ColorButton(colors.lightblue, "fill"),
            ColorButton(colors.lightred, "fill")
          )
        ),
      ];
    }

    function DarkColorButtons() {
      // used by multiple context menus
      return [
        $(
          "ContextMenuButton",
          $(
            go.Panel,
            "Horizontal",
            ColorButton(colors.black, ""),
            ColorButton(colors.green, ""),
            ColorButton(colors.blue, ""),
            ColorButton(colors.red, "")
          )
        ),
        $(
          "ContextMenuButton",
          $(
            go.Panel,
            "Horizontal",
            ColorButton(colors.white, ""),
            ColorButton(colors.magenta, ""),
            ColorButton(colors.purple, ""),
            ColorButton(colors.orange, "")
          )
        ),
      ];
    }

    // Create a context menu button for setting a data property with a stroke width value.
    function ThicknessButton(sw: any, propname: any) {
      if (!propname) propname = "thickness";
      return $(go.Shape, "LineH", {
        width: 16,
        height: 16,
        strokeWidth: sw,
        margin: 1,
        background: "transparent",
        mouseEnter: (e: any, shape: any) => (shape.background = "dodgerblue"),
        mouseLeave: (e: any, shape: any) => (shape.background = "transparent"),
        click: ClickFunction(propname, sw),
        contextClick: ClickFunction(propname, sw),
      });
    }

    // Create a context menu button for setting a data property with a stroke dash Array value.
    function DashButton(dash: any, propname: any) {
      if (!propname) propname = "dash";
      return $(go.Shape, "LineH", {
        width: 24,
        height: 16,
        strokeWidth: 2,
        strokeDashArray: dash,
        margin: 1,
        background: "transparent",
        mouseEnter: (e: any, shape: any) => (shape.background = "dodgerblue"),
        mouseLeave: (e: any, shape: any) => (shape.background = "transparent"),
        click: ClickFunction(propname, dash),
        contextClick: ClickFunction(propname, dash),
      });
    }

    function StrokeOptionsButtons() {
      // used by multiple context menus
      return [
        $(
          "ContextMenuButton",
          $(
            go.Panel,
            "Horizontal",
            ThicknessButton(1, ""),
            ThicknessButton(2, ""),
            ThicknessButton(3, ""),
            ThicknessButton(4, "")
          )
        ),
        $(
          "ContextMenuButton",
          $(
            go.Panel,
            "Horizontal",
            DashButton(null, ""),
            DashButton([2, 4], ""),
            DashButton([4, 4], "")
          )
        ),
      ];
    }

    function changeColor(diagram: any, color: any, propname: any) {
      diagram.startTransaction("change color");
      diagram.selection.each((selection: any) => {
        if (selection instanceof go.Node) {
          var data = selection.data;
          diagram.model.setDataProperty(data, propname, color);
        } else if (selection instanceof go.Link) {
          var data = selection.data;
          diagram.model.setDataProperty(data, propname, color);
        }
      });
      diagram.commitTransaction("change color");
    }

    function ColorPickerButton(propname: any) {
      if (!propname) propname = "color";
      var selectedColor: any;
      return $(
        go.Shape,
        "RoundedRectangle",
        {
          name: "SHAPE_" + propname.toUpperCase(),
          width: 85,
          height: 20,
          margin: 4,
          click: (e: any, obj: any) => {
            var colorInput = document.createElement("input");
            colorInput.type = "color";
            colorInput.addEventListener("change", function (event: any) {
              selectedColor = event.target.value;
              console.log("Selected color:", selectedColor);

              // Update the shape's fill based on propname
              // if (obj.part) {
              //   obj.part.findObject("SHAPE_" + propname.toUpperCase()).fill =
              //     selectedColor;
              // }
              changeColor(diagram, selectedColor, propname);
            });

            colorInput.click();
          },
        },
        new go.Binding("fill", propname).makeTwoWay()
      );
    }

    diagram.nodeTemplate.contextMenu = $(
      "ContextMenu",
      $(
        "ContextMenuButton",
        $(go.Panel, "Vertical", ColorPickerButton("fill"))
      ),
      LightFillButtons(),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Vertical",
          $(go.Shape, "Rectangle", { width: 85, height: 0.3, margin: 2 })
        )
      ),
      $(
        "ContextMenuButton",
        $(go.Panel, "Vertical", ColorPickerButton("color"))
      ),
      DarkColorButtons(),
      StrokeOptionsButtons()
    );

    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Routing.AvoidsNodes,
        selectable: true,
        curve: go.Curve.JumpGap,
        adjusting: go.LinkAdjusting.Stretch,
        // resegmentable: true,
        reshapable: true,
        resizable: true,
        corner: 10,
        fromShortLength: 6,
        toShortLength: 8,
        fromPortId: "",
        toPortId: "",
        fromEndSegmentLength: 30,
        toEndSegmentLength: 30,
        layerName: "Foreground",
        visible: true,
        doubleClick: (e: any, link: any) => {
          e.diagram.model.commit((m: any) => {
            if (!link.data.text || /^\s*$/.test(link.data.text)) {
              m.set(link.data, "text", "Label");
            }
          });
        },
      },
      new go.Binding("curve", "curve").makeTwoWay(),
      new go.Binding("routing", "routing").makeTwoWay(),
      new go.Binding("fromSpot", "fromSpot", go.Spot.parse, go.Spot.stringify),
      new go.Binding("toSpot", "toSpot", go.Spot.parse, go.Spot.stringify),
      new go.Binding("fromShortLength", "dir", (dir) => (dir >= 1 ? 10 : 0)),
      new go.Binding("toShortLength", "dir", (dir) => (dir >= 1 ? 10 : 0)),
      new go.Binding("fromPortId", "fromPort").makeTwoWay(),
      new go.Binding("toPortId", "toPort").makeTwoWay(),
      new go.Binding("points").makeTwoWay(),
      new go.Binding("relinkableFrom", "canRelink").ofModel(),
      new go.Binding("relinkableTo", "canRelink").ofModel(),
      $(
        go.Shape,
        { isPanelMain: true, stroke: "#595959", strokeWidth: 2 },
        new go.Binding("stroke", "color"),
        new go.Binding("strokeWidth", "thickness"),
        new go.Binding("strokeDashArray", "dash")
      ),
      $(
        go.Shape,
        { isPanelMain: true, stroke: "transparent", strokeWidth: 2 },
        new go.Binding("strokeWidth", "thickness")
      ),
      $(
        go.Shape,
        {
          toArrow: "Standard",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("visible", "dir", (dir) => dir == 1)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 2 ? "Backward" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 2)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 2 ? "Standard" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 2)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 3 ? "InverseLine" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 3)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 4 ? "Line" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 4)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 5 ? "BackwardFork" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 5)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 6 ? "Fork" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 6)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 7 ? "InverseDoubleLine" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 7)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 8 ? "DoubleLine" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 8)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 9 ? "InverseOptionalLine" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 9)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 10 ? "OptionalLine" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 10)
      ),
      $(
        go.Shape,
        {
          fromArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("fromArrow", "dir", function (dir) {
          return dir === 11 ? "BackwardCircleFork" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 11)
      ),
      $(
        go.Shape,
        {
          toArrow: "",
          stroke: "#4d4d4d",
          fill: "#4d4d4d",
          scale: 2,
        },
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color"),
        new go.Binding("toArrow", "dir", function (dir) {
          return dir === 12 ? "CircleFork" : "";
        }),
        new go.Binding("visible", "dir", (dir) => dir == 12)
      ),
      {
        // Highlighting the link when selected: WE CHANGE THIS
        mouseEnter: (e: any, link: any) => {
          link.elt(1).stroke = "rgba(215, 240, 230, 0.3)";
        },
        mouseLeave: (e: any, link: any) => {
          link.elt(1).stroke = "transparent";
        },
      },
      $(
        go.Panel,
        "Auto",
        { cursor: "move" },
        // $(
        //   go.Shape, // the label background, which becomes transparent around the edges
        //   {
        //     fill: $(go.Brush, "Radial", {
        //       0.2: "rgb(13, 13, 13)",
        //       0.3: "rgb(13, 13, 13)",
        //       0.5: "rgba(13, 13, 13, 0)",
        //     }),
        //     stroke: null,
        //   }
        // ),
        $(
          go.TextBlock,
          "", // the label text
          {
            textAlign: "center",
            font: "1em helvetica, sans-serif",
            stroke: "white",
            margin: 4,
            editable: true, // editing the text automatically updates the model data
          },
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("stroke", "color"),
          new go.Binding("font", "fontType"),
          new go.Binding("isUnderline", "setUnderline")
        ),
        new go.Binding(
          "segmentOffset",
          "segmentOffset",
          go.Point.parse
        ).makeTwoWay(go.Point.stringify)
      )
    );

    diagram.linkTemplate.selectionAdornmentTemplate = $(
      go.Adornment, // use a special selection Adornment that does not obscure the link path itself
      $(
        go.Shape,
        {
          // this uses a pathPattern with a gap in it, in order to avoid drawing on top of the link path Shape
          isPanelMain: true,
          stroke: "transparent",
          strokeWidth: 2,
          pathPattern: makeAdornmentPathPattern(2), // == thickness or strokeWidth
        },
        new go.Binding("pathPattern", "thickness", makeAdornmentPathPattern)
      ),
      CMButton({ alignmentFocus: new go.Spot(0, 0, -6, -4) })
    );

    function makeAdornmentPathPattern(w: any) {
      return $(go.Shape, {
        stroke: "#2c4247",
        strokeWidth: 2,
        strokeCap: "round",
        geometryString: "M0 0 M0 3 H3 M0 " + (w + 4).toString() + " H3",
      });
    }

    function ArrowButton(num: any) {
      var geo =
        "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 3 0 L 8 4 M 3 8 L 8 4";
      if (num === 0) {
        geo = "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4";
      } else if (num === 2) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 3 0 L 8 4 M 3 8 L 8 4 M -11 0 L -16 4 L -11 8";
      } else if (num === 3) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M -13 0 L -13 8";
      } else if (num === 4) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 5 0 L 5 8";
      } else if (num === 5) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 M -16 0 L -8 4 M -16 4 L -8 4 M -16 8 L -8 4";
      } else if (num === 6) {
        geo =
          "m 0 4 l 8 0 m -8 0 l 8 -4 m -8 4 l 8 4 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4";
      } else if (num === 7) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M -11 0 L -11 8 M -13 0 L -13 8";
      } else if (num === 8) {
        geo =
          "m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 3 0 L 3 8 M 5 0 L 5 8";
      } else if (num === 9) {
        geo =
          "F1 m -0 -4 l -8 0 m 8 -0 M 8 -4 L -0 -4 L 8 -4 M 16 -4 L 8 -4 L 8 -4 M -5 0 L -5 -8 M -3 -4 A 1 1 180 0 0 2 -4 A 1 1 180 0 0 -3 -4";
      } else if (num === 10) {
        geo =
          "F1 m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 L -8 4 M -16 4 L -8 4 L -8 4 M 5 0 L 5 8 M 3 4 A 1 1 0 0 0 -2 4 A 1 1 0 0 0 3 4";
      } else if (num === 11) {
        geo =
          "F1 m 0 4 l 8 0 m -8 0 M -8 4 L 0 4 M -16 0 L -8 4 M -16 4 L -8 4 M -16 8 L -8 4 A 1 1 0 0 0 -3 4 A 1 1 0 0 0 -8 4";
      } else if (num === 12) {
        geo =
          "F1 m 0 4 l 8 0 m -8 0 l 8 -4 m -8 4 l 8 4 M -8 4 L 0 4 A 1 1 0 0 0 -5 4 A 1 1 0 0 0 0 4 L -8 4 M -16 4 L -8 4 L -8 4";
      }
      return $(go.Shape, {
        geometryString: geo,
        margin: 2,
        background: "transparent",
        mouseEnter: (e: any, shape: any) => (shape.stroke = "dodgerblue"),
        mouseLeave: (e: any, shape: any) => (shape.stroke = "black"),
        click: ClickFunction("dir", num),
        contextClick: ClickFunction("dir", num),
      });
    }

    diagram.linkTemplate.contextMenu = $(
      "ContextMenu",
      DarkColorButtons(),
      StrokeOptionsButtons(),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Horizontal",
          ArrowButton(0),
          ArrowButton(1),
          ArrowButton(2),
          ArrowButton(3)
        )
      ),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Horizontal",
          ArrowButton(4),
          ArrowButton(5),
          ArrowButton(6),
          ArrowButton(7)
        )
      ),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Horizontal",
          ArrowButton(8),
          ArrowButton(9),
          ArrowButton(10),
          ArrowButton(11)
        )
      ),
      $("ContextMenuButton", $(go.Panel, "Horizontal", ArrowButton(12))),
      $(
        "ContextMenuButton",
        $(go.Panel, "Vertical", ColorPickerButton("color"))
      )
    );

    diagram.groupTemplate = $(
      go.Group,
      "Vertical",
      {
        selectionObjectName: "PANEL", // selection handle goes around shape, not label
        ungroupable: true, // enable Ctrl-Shift-G to ungroup a selected Group
      },
      $(
        go.TextBlock,
        {
          //alignment: go.Spot.Right,
          stroke: "dodgerblue",
          font: "bold 19px sans-serif",
          margin: 4,
          isMultiline: false, // don't allow newlines in text
          editable: true, // allow in-place editing by user
        },
        new go.Binding("text", "text").makeTwoWay(),
        new go.Binding("stroke", "color")
      ),
      $(
        go.Panel,
        "Auto",
        { name: "PANEL" },
        $(
          go.Shape,
          "Rectangle", // the rectangular shape around the members
          {
            fill: "rgba(128,128,128,0.2)",
            stroke: "gray",
            strokeWidth: 3,
            // portId: "",
            cursor: "pointer", // the Shape is the port, not the whole Node
            // allow all kinds of links from and to this port
            fromLinkable: true,
            fromLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: true,
            toLinkableDuplicates: true,
          },
          new go.Binding("fill"),
          new go.Binding("stroke", "color"),
          new go.Binding("strokeWidth", "thickness"),
          new go.Binding("strokeDashArray", "dash")
        ),
        $(go.Placeholder, { margin: 10, background: "transparent" }), // represents where the members are
        makePort("T", go.Spot.Top, true, true),
        makePort("TLM", new go.Spot(0.2, 0, 0, 0), true, true),
        makePort("TRM", new go.Spot(0.8, 0, 0, 0), true, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("BLM", new go.Spot(0.2, 1, 0, 0), true, true),
        makePort("BRM", new go.Spot(0.8, 1, 0, 0), true, true),
        makePort("B", go.Spot.Bottom, true, true)
      ),

      {
        // handle mouse enter/leave events to show/hide the ports
        mouseEnter: (e, group: any) => {
          showGroupPorts(group, true);
        },
        mouseLeave: (e, group: any) => {
          showGroupPorts(group, false);
        },
      }
    );

    diagram.groupTemplate.selectionAdornmentTemplate = $(
      go.Adornment,
      "Spot",
      $(
        go.Panel,
        "Auto",
        $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
        $(go.Placeholder, { margin: 1.5 })
      ),
      CMButton({
        alignment: go.Spot.TopRight,
        alignmentFocus: go.Spot.BottomRight,
      })
    );

    diagram.groupTemplate.contextMenu = $(
      "ContextMenu",
      $(
        "ContextMenuButton",
        $(go.Panel, "Vertical", ColorPickerButton("fill"))
      ),
      LightFillButtons(),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Vertical",
          $(go.Shape, "Rectangle", { width: 85, height: 0.3, margin: 2 })
        )
      ),
      $(
        "ContextMenuButton",
        $(go.Panel, "Vertical", ColorPickerButton("color"))
      ),
      DarkColorButtons(),
      StrokeOptionsButtons()
    );

    return diagram;
  };

  const initPalette = () => {
    const $ = go.GraphObject.make;
    const palette = $(go.Palette, {
      padding: new go.Margin(68, 0, 0, 0),
      maxSelectionCount: 1,
      linkTemplate: $(
        go.Link,
        {
          // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
          // to line up the Link in the same manner we have to pretend the Link has the same location spot
          maxSize: new go.Size(42, 42),
        },
        {
          routing: go.Routing.Normal,
          corner: 5,
          toShortLength: 4,
        },
        new go.Binding("points"),
        new go.Binding("routing", "routing"),
        $(
          go.Shape, // the link path shape
          { isPanelMain: true, strokeWidth: 2, stroke: "white" }
        ),
        $(
          go.Shape, // the arrowhead
          { toArrow: "Standard", stroke: "white", fill: "white" }
        )
      ),
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key",
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        makeUniqueKeyFunction: (m: go.Model, data: any) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          data.key = k;
          return k;
        },
        makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
          let k = data.key || -1;
          while (m.findLinkDataForKey(k)) k--;
          data.key = k;
          return k;
        },
      }),
    });

    palette.nodeTemplate = $(
      go.Node,
      "Vertical",
      $(
        go.Shape,
        {
          strokeWidth: 1.6,
          stroke: "white",
          maxSize: new go.Size(42, 42),
          fill: "#262626",
          cursor: "pointer",
        },
        new go.Binding("figure", "shape", (shape) => {
          // Map the shape property to the corresponding figure property for the flowchart shape
          switch (shape) {
            case "Start":
              return "Ellipse";
            case "Process":
              return "Rectangle";
            case "Decision":
              return "Diamond";
            case "Input":
              return "Input";
            case "Initial State":
              return "Circle";
            case "State Box":
              return "RoundedRectangle";
            case "EndState":
              return "EndState";
            case "Guard":
              return "Diamond";
            case "Actor":
              return "Actor";
            case "Object":
              return "Rectangle";
            case "Time Event":
              return "Collate";
            case "Flow Final":
              return "Junction";
            case "Fork":
              return "Fork";
            case "File":
              return "File";
            case "Strong Entity":
              return "Rectangle";
            case "Weak Entity":
              return "WeakEntity";
            case "Associative Entity":
              return "AssociativeEntity";
            case "Weak Relationship":
              return "WeakRelationship";
            case "Multivalued":
              return "Multivalued";
            // Add more shape mappings as needed
            default:
              return "RoundedRectangle"; // Default to RoundedRectangle if shape is not recognized
          }
        })
      )
      // $(
      //   go.TextBlock,
      //   {
      //     textAlign: "center",
      //     margin: 6,
      //     font: "400 1rem Tahoma, sans-serif",
      //     stroke: "black",
      //   },
      //   new go.Binding("text", "shape")
      // )
    );

    return palette;
  };

  const saveJSON = () => {
    const diagram = diagramRef.current?.getDiagram();
    const jsonData = diagram?.model.toJson();
    const filename = diagramName || "mistleDiagram";

    if (jsonData) {
      const blob = new Blob([jsonData], { type: "application/json" });

      saveAs(blob, `${filename}.json`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        importJSON(fileContent);
      };
      reader.readAsText(file);
    }
  };

  const importJSON = (jsonString: string) => {
    const diagram = diagramRef.current?.getDiagram();
    if (diagram) {
      diagram.model = go.Model.fromJson(jsonString);
    }
  };

  // To save the diagram as a PNG file

  function myPNGCallback(blob: any) {
    var url = window.URL.createObjectURL(blob);
    var filename = diagramName || "mistleDiagram";

    var a = document.createElement("a");
    a.setAttribute("style", "display: none");
    a.href = url;
    a.download = `${filename}.png`;

    // In case someone is still using IE 11 xD
    if ((window.navigator as any).msSaveBlob !== undefined) {
      (window.navigator as any).msSaveBlob(blob, `${filename}.png`);
      return;
    }

    document.body.appendChild(a);
    requestAnimationFrame(() => {
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  function makePNGBlob() {
    const diagram = diagramRef.current?.getDiagram();
    var blob = diagram?.makeImageData({
      background: backgroundColor,
      scale: 2,
      maxSize: new go.Size(Infinity, Infinity),
      returnType: "blob",
      callback: myPNGCallback,
    });
  }

  // To save the diagram as a SVG file

  function mySVGCallback(blob: any) {
    var url = window.URL.createObjectURL(blob);
    var filename = diagramName || "mistleDiagram";

    var a = document.createElement("a");
    a.setAttribute("style", "display: none");
    a.href = url;
    a.download = `${filename}.svg`;

    // In case someone is still using IE 11 xD
    if ((window.navigator as any).msSaveBlob !== undefined) {
      (window.navigator as any).msSaveBlob(blob, `${filename}.svg`);
      return;
    }

    document.body.appendChild(a);
    requestAnimationFrame(() => {
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  function makeSVGBlob() {
    const diagram = diagramRef.current?.getDiagram();
    var svg = diagram?.makeSvg({ scale: 1, background: backgroundColor });
    if (svg) {
      var svgstr = new XMLSerializer().serializeToString(svg);
      var blob = new Blob([svgstr], { type: "image/svg+xml" });
      mySVGCallback(blob);
    }
  }

  function handleSave(filetype: string) {
    if (filetype === "JSON") {
      saveJSON();
    } else if (filetype === "SVG") {
      makeSVGBlob();
    } else if (filetype === "PNG") {
      makePNGBlob();
    } else {
      console.error("Invalid file type");
    }
  }

  function changeGridStroke(diagram: any, color: any) {
    diagram.startTransaction("change grid stroke");
    diagram.grid.findObject("GRID").elements.each((shape: any) => {
      if (shape instanceof go.Shape) {
        shape.stroke = color;
      }
    });
    diagram.commitTransaction("change grid stroke");
  }

  const zoomToFit = () => {
    const diagram: any = diagramRef.current?.getDiagram();
    diagram.commandHandler.zoomToFit();
  };

  function changeText(diagram: any, color: any, propname: any) {
    diagram.startTransaction("change text");
    diagram.selection.each((selection: any) => {
      if (selection instanceof go.Node) {
        var data = selection.data;
        diagram.model.setDataProperty(data, propname, color);
      } else if (selection instanceof go.Link) {
        var data = selection.data;
        diagram.model.setDataProperty(data, propname, color);
      }
    });
    diagram.commitTransaction("change text");
  }

  function addNote() {
    const diagram: any = diagramRef.current?.getDiagram();
    console.log(diagram);

    diagram.startTransaction("add note");

    // create a new node data object
    const newNodeData = {
      text: "Note",
      fill: "lightgreen",
      shape: "File",
      loc: "-455 -105",
    };
    // add the new node data to the model
    diagram.model.addNodeData(newNodeData);

    diagram.commitTransaction("add note");
  }

  return (
    <>
      <ReactDiagram
        ref={diagramRef}
        divClassName="diagram-component"
        style={diagramStyle}
        initDiagram={initDiagram}
        nodeDataArray={props.nodeDataArray}
        linkDataArray={props.linkDataArray}
        modelData={props.modelData}
        onModelChange={props.onModelChange}
        skipsDiagramUpdate={props.skipsDiagramUpdate}
      />

      {!loading && (
        <div className="flex relative z-50 bg-transparent justify-center items-center min-h-screen">
          <img
            src="/logo.svg"
            alt="loading"
            className="w-24 h-24 animate-bounce"
          />
        </div>
      )}
      <div
        className={`${
          pallete
            ? "opacity-100 left-[66px] z-50"
            : "opacity-0 left-[46px] -z-10"
        } fixed top-[17%] flex flex-col justify-between items-center gap-5 py-5 w-56 rounded-3xl border-2 border-purple-400 bg-neutral-800  transition-all duration-300 ease-in-out`}
      >
        <ReactPalette
          initPalette={initPalette}
          divClassName="palette-component"
          nodeDataArray={nodeDataArray || []}
          linkDataArray={linkDataArray}
        />
        <select
          value={selectedOption}
          onChange={handleOptionChange}
          className="w-40 p-1.5 text-black rounded outline-none bg-white "
        >
          <option value="option1">Flowchart</option>
          <option value="option2">State/Activity Diagram</option>
          <option value="option3">Block Diagram</option>
          <option value="option4">Collaboration Diagram</option>
          <option value="option5">Entity Relationship Diagram</option>
        </select>
        <div className="absolute text-purple-400 text-xl font-medium z-50 h-[66px] w-48 bg-neutral-800 flex items-start py-2 justify-center">
          Shapes
          <div className="absolute w-full h-[1.5px] bg-white bottom-4"></div>
        </div>
      </div>
      <TextStyles
        textStyles={textStyles}
        changeText={changeText}
        diagramRef={diagramRef}
      />
      <Topleftbar
        loading={loading}
        diagramName={diagramName}
        handleNameChange={handleNameChange}
        handleKeyPress={handleKeyPress}
        handleFileChange={handleFileChange}
        handleSave={handleSave}
        setDiagramName={setDiagramName}
        format={format}
        setFormat={setFormat}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
      />
      <div
        className={`${loading ? "show" : "load"}
      fixed z-10 top-6 right-4`}
      >
        <HeaderAvatar showText={false} openLink="_self" />
      </div>
      <Leftbar
        loading={loading}
        pallete={pallete}
        setPallete={setPallete}
        togglePalette={togglePalette}
        textStyles={textStyles}
        setTextStyles={setTextStyles}
        toggleTextStyles={toggleTextStyles}
        linkType={linkType}
        setLinkType={setLinkType}
        diagramRef={diagramRef}
        addNote={addNote}
      />
      <Settings
        loading={loading}
        theme={theme}
        guide={guide}
        grid={grid}
        fscreen={fscreen}
        zoomToFit={zoomToFit}
        toggleGuidedDraggingTool={toggleGuidedDraggingTool}
        handleToggleGuides={handleToggleGuides}
        toggleGrid={toggleGrid}
        toggleFullScreen={toggleFullScreen}
        handleThemeChanges={handleThemeChanges}
      />
    </>
  );
};

export default DiagramWrapper;
