import * as go from "gojs";
import { ReactDiagram, ReactPalette } from "gojs-react";
import * as React from "react";
import { saveAs } from "file-saver";
import "./extensions/figures";
import RescalingTool from "./extensions/RescalingTool";
import DrawCommandHandler from "./extensions/DrawCommandHandler";
import GuidedDraggingTool from "./extensions/GuidedDraggingTool";
import LinkLabelDraggingTool from "./extensions/LinkLabelDraggingTool";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import "./DiagramWrapper.css";

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
  const diagramStyle = { backgroundColor: "#eee" };

  const [grid, setGrid] = React.useState(true);
  const [pallete, setPallete] = React.useState(false);
  const [diagramName, setDiagramName] = React.useState("");
  const [format, setFormat] = React.useState("");

  const [selectedOption, setSelectedOption] = React.useState("option1");

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  let nodeDataArray: any;
  switch (selectedOption) {
    case "option1":
      nodeDataArray = [
        { key: "0", color: "white", text: "Start", shape: "Start" },
        { key: "1", color: "white", text: "Yes/No", shape: "Decision" },
        { key: "2", color: "white", text: "Process", shape: "Process" },
        { key: "3", color: "white", text: "Input", shape: "Input" },
      ];
      break;
    case "option2":
      nodeDataArray = [
        {
          key: "0",
          color: "white",
          text: "",
          shape: "Initial State",
        },
        { key: "1", color: "white", text: "State-Box", shape: "State Box" },
        { key: "2", color: "white", text: "Condition", shape: "Guard" },
        { key: "3", color: "white", text: "", shape: "EndState" },
      ];
      break;
    case "option3":
      nodeDataArray = [
        { key: "0", color: "white", text: "Block", shape: "Block" },
      ];
      break;
    case "option4":
      nodeDataArray = [
        { key: "0", color: "white", text: "", shape: "Actor" },
        { key: "1", color: "white", text: "Message", shape: "Message Flow" },
        { key: "2", color: "white", text: ":Object", shape: "Object" },
      ];
      break;
    default:
      nodeDataArray = [];
  }

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
      diagram.toolManager.mouseMoveTools.insertAt(
        0,
        new LinkLabelDraggingTool()
      );
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
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
      "clickCreatingTool.archetypeNodeData": {
        text: "New Node",
        color: "white",
      },
      "commandHandler.archetypeGroupData": {
        text: "Name This Group",
        isGroup: true,
        color: "dodgerblue",
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
      // From ClickCreatingTool
      var animation = new go.Animation();
      addCreatedPart(e.subject, animation);
      animation.start();
    });

    function addCreatedPart(part: any, animation: any) {
      animation.add(part, "scale", 0.01, part.scale);
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

    function mouseIn(e: any, obj: any) {
      var shape = obj.findObject("SHAPE");
      shape.fill = "#e3dcf2";
      shape.stroke = "black";
    }

    function mouseOut(e: any, obj: any) {
      var shape = obj.findObject("SHAPE");
      // Return the Shape's fill and stroke to the defaults
      if (obj.data?.color != undefined) {
        shape.fill = obj.data?.color;
      }
      shape.stroke = "black";
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

    diagram.toolManager.linkingTool.temporaryFromNode = tempfromnode;
    diagram.toolManager.linkingTool.temporaryFromPort = tempfromnode.port;
    diagram.toolManager.linkingTool.temporaryToNode = temptonode;
    diagram.toolManager.linkingTool.temporaryToPort = temptonode.port;

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
        stroke: "#000000",
        strokeWidth: 0.5,
        interval: 1,
      }),
      $(go.Shape, "LineH", {
        stroke: "#000000",
        strokeWidth: 0.5,
        interval: 5,
      }),
      $(go.Shape, "LineH", {
        stroke: "#000000",
        strokeWidth: 1.0,
        interval: 10,
      }),
      $(go.Shape, "LineV", {
        stroke: "#000000",
        strokeWidth: 0.5,
        interval: 1,
      }),
      $(go.Shape, "LineV", {
        stroke: "#000000",
        strokeWidth: 0.5,
        interval: 5,
      }),
      $(go.Shape, "LineV", {
        stroke: "#000000",
        strokeWidth: 1.0,
        interval: 10,
      })
    );

    diagram.toolManager.draggingTool.isGridSnapEnabled = grid;
    diagram.toolManager.resizingTool.isGridSnapEnabled = grid;
    diagram.toolManager.mouseDownTools.add(new RescalingTool());

    diagram.nodeTemplate = $(
      go.Node,
      "Spot",
      {
        minSize: new go.Size(30, 30),
        locationSpot: go.Spot.Center,
        rotatable: true,
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
            strokeWidth: 2,
            portId: "",
            fromLinkable: true,
            toLinkable: true,
            fromLinkableSelfNode: true,
            toLinkableSelfNode: true,
            //fromLinkableDuplicates: true, for multiple links to one node
            //toLinkableDuplicates: true,   for multiple links to one node
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
              case "Message Flow":
                return "LogicImplies";
              // Add more shape mappings as needed
              default:
                return "RoundedRectangle"; // Default to RoundedRectangle if shape is not recognized
            }
          }),
          new go.Binding("fill", "color")
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
            overflow: go.TextBlock.OverflowEllipsis,
            margin: 6,
            editable: true,
            font: "400 1.2rem Tahoma, sans-serif",
            stroke: "black",
          },
          new go.Binding("text", "text").makeTwoWay()
        )
      ),
      makePort("T", go.Spot.Top, true, true),
      makePort("L", go.Spot.Left, true, true),
      makePort("R", go.Spot.Right, true, true),
      makePort("B", go.Spot.Bottom, true, true),
      {
        // handle mouse enter/leave events to show/hide the ports
        mouseEnter: (e, node: any) => {
          showSmallPorts(node, true), mouseIn(e, node);
        },
        mouseLeave: (e, node: any) => {
          showSmallPorts(node, false), mouseOut(e, node);
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

    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.Bezier,
        selectable: true,
        curve: go.Link.JumpGap,
        adjusting: go.Link.Stretch,
        // resegmentable: true,

        reshapable: true,
        resizable: true,
        corner: 10,
        toShortLength: 4,
        fromShortLength: 4,
        fromPortId: "",
        toPortId: "",
        fromEndSegmentLength: 8,
        toEndSegmentLength: 30,
        layerName: "Foreground",
        visible: true,
      },
      new go.Binding("fromPortId", "fromPort").makeTwoWay(),
      new go.Binding("toPortId", "toPort").makeTwoWay(),
      new go.Binding("points").makeTwoWay(),
      new go.Binding("relinkableFrom", "canRelink").ofModel(),
      new go.Binding("relinkableTo", "canRelink").ofModel(),
      // $(go.Shape, { isPanelMain: true, stroke: "transparent"}),
      $(go.Shape, { isPanelMain: true, stroke: "grey", strokeWidth: 2 }),
      $(go.Shape, { toArrow: "Standard", stroke: "grey", fill: "grey" }),
      {
        // Highlighting the link when selected:
        mouseEnter: (e: any, link: any) => {
          (link.elt(0).stroke = "white"),
            (link.elt(1).fill = "white"),
            (link.elt(1).stroke = "white");
        },
        mouseLeave: (e: any, link: any) => {
          (link.elt(0).stroke = "grey"),
            (link.elt(1).fill = "grey"),
            (link.elt(1).stroke = "grey");
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
          "Label", // the label text
          {
            textAlign: "center",
            font: "10pt helvetica, arial, sans-serif",
            stroke: "white",
            margin: 4,
            editable: true, // editing the text automatically updates the model data
          },
          new go.Binding("text", "text").makeTwoWay()
        ),
        new go.Binding(
          "segmentOffset",
          "segmentOffset",
          go.Point.parse
        ).makeTwoWay(go.Point.stringify)
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
          font: "bold 19px sans-serif",
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
          }
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

    return diagram;
  };

  const initPalette = () => {
    const $ = go.GraphObject.make;
    const palette = $(go.Palette);

    palette.nodeTemplate = $(
      go.Node,
      "Vertical",
      $(
        go.Shape,
        {
          strokeWidth: 1,
          fill: "white",
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
            case "Message Flow":
              return "Arrow";
            // Add more shape mappings as needed
            default:
              return "RoundedRectangle"; // Default to RoundedRectangle if shape is not recognized
          }
        })
      ),
      $(
        go.TextBlock,
        {
          textAlign: "center",
          margin: 6,
          font: "400 1rem Tahoma, sans-serif",
          stroke: "black",
        },
        new go.Binding("text", "shape")
      )
    );

    return palette;
  };

  const saveJSON = () => {
    console.log("JSON RAN");

    const diagram = diagramRef.current?.getDiagram();
    const jsonData = diagram?.model.toJson();

    if (jsonData) {
      const blob = new Blob([jsonData], { type: "application/json" });

      saveAs(blob, `${diagramName}.json`);
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
    var filename = `${diagramName}.png`;

    var a = document.createElement("a");
    a.setAttribute("style", "display: none");
    a.href = url;
    a.download = filename;

    // In case someone is still using IE 11 xD
    if ((window.navigator as any).msSaveBlob !== undefined) {
      (window.navigator as any).msSaveBlob(blob, filename);
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
    console.log("PNG RAN");
    const diagram = diagramRef.current?.getDiagram();
    var blob = diagram?.makeImageData({
      background: "transparent",
      scale: 2,
      maxSize: new go.Size(Infinity, Infinity),
      returnType: "blob",
      callback: myPNGCallback,
    });
  }

  // To save the diagram as a SVG file

  function mySVGCallback(blob: any) {
    console.log("SVG RAN");
    var url = window.URL.createObjectURL(blob);
    var filename = `${diagramName}.svg`;

    var a = document.createElement("a");
    a.setAttribute("style", "display: none");
    a.href = url;
    a.download = filename;

    // In case someone is still using IE 11 xD
    if ((window.navigator as any).msSaveBlob !== undefined) {
      (window.navigator as any).msSaveBlob(blob, filename);
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
    console.log("SVG RAN");
    const diagram = diagramRef.current?.getDiagram();
    var svg = diagram?.makeSvg({ scale: 1, background: "transparent" });
    if (svg) {
      var svgstr = new XMLSerializer().serializeToString(svg);
      var blob = new Blob([svgstr], { type: "image/svg+xml" });
      mySVGCallback(blob);
    }
  }

  function handleCancel() {
    setDiagramName("");
    setFormat("");
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
    setDiagramName("");
    setFormat("");
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
      <div className={`${pallete ? "containerVisible" : "containerHidden"}`}>
        <ReactPalette
          initPalette={initPalette}
          divClassName="palette-component"
          nodeDataArray={nodeDataArray || []}
        />
        <select value={selectedOption} onChange={handleOptionChange}>
          <option value="option1">Flowchart</option>
          <option value="option2">State Chart</option>
          <option value="option3">Block Diagram</option>
          <option value="option4">Collaboration Diagram</option>
        </select>
      </div>
      <div className="fixed flex justify-center items-center left-5 bottom-5 z-50">
        <input
          type="file"
          onChange={(e) => handleFileChange(e)}
          accept=".json"
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="btn cursor-pointer">
          Load
        </label>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="btn">Save</button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-[385px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl text-main">
                Save Diagram
              </AlertDialogTitle>
              <AlertDialogDescription>
                Choose Name and Format to save your Diagram.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 my-2 ">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Name of your diagram"
                  value={diagramName}
                  onChange={(e) => setDiagramName(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="filetype">Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger id="filetype">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="JSON">JSON</SelectItem>
                    <SelectItem value="SVG">SVG</SelectItem>
                    <SelectItem value="PNG">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <AlertDialogFooter className="mt-10">
              <AlertDialogCancel onClick={handleCancel}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleSave(format)}
                disabled={!diagramName || !format}
                className="px-6 bg-neutral-800 text-neutral-50 hover:bg-main font-semibold"
              >
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <button
          className="btn"
          onClick={() => setGrid((prevGrid) => !prevGrid)}
        >
          {grid ? "Hide Grid" : "Show Grid"}
        </button>
        <button
          className="btn"
          onClick={() => setPallete((prevPallete) => !prevPallete)}
        >
          {pallete ? "Hide Pallete" : "Show Pallete"}
        </button>
      </div>
    </>
  );
};

export default DiagramWrapper;
