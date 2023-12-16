import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import React, { useEffect, useRef } from "react";

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
  const diagramRef = useRef<ReactDiagram>(null);
  const diagramStyle = { backgroundColor: "#eee" };

  useEffect(() => {
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

  const initDiagram = (): go.Diagram => {
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, {
      "undoManager.isEnabled": true,
      "clickCreatingTool.archetypeNodeData": {
        text: "New node",
        color: "#6547eb",
      },
      layout: $(go.ForceDirectedLayout),
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key",
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

    diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(
        go.Shape,
        "RoundedRectangle",
        {
          name: "SHAPE",
          fill: "white",
          strokeWidth: 0,
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer",
        },
        new go.Binding("fill", "color")
      ),
      $(
        go.TextBlock,
        { margin: 8, editable: true, font: "400 .875rem Roboto, sans-serif" },
        new go.Binding("text").makeTwoWay()
      )
    );

    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.Normal,
        curve: go.Link.Bezier,
        corner: 10,
        toShortLength: 4,
        fromShortLength: 4,
        fromEndSegmentLength: 20,
        toEndSegmentLength: 20,
        layerName: "Background",
        visible: true,
      },
      new go.Binding("relinkableFrom", "canRelink").ofModel(),
      new go.Binding("relinkableTo", "canRelink").ofModel(),
      $(go.Shape, { stroke: "white" }),
      $(go.Shape, { toArrow: "Standard", stroke: "white", fill: "white" })
    );

    return diagram;
  };

  return (
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
  );
};

export default DiagramWrapper;
