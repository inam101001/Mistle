"use client";
import * as go from "gojs";
import { produce } from "immer";
import * as React from "react";

import DiagramWrapper from "./DiagramWrapper";

interface AppState {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  selectedData: go.ObjectData | null;
  skipsDiagramUpdate: boolean;
}

class App extends React.Component<{}, AppState> {
  // Maps to store key -> arr index for quick lookups
  private mapNodeKeyIdx: Map<go.Key, number>;
  private mapLinkKeyIdx: Map<go.Key, number>;

  constructor(props: object) {
    super(props);
    this.state = {
      nodeDataArray: [
        {
          text: "Start",
          color: "white",
          shape: "Start",
          key: 1,
          loc: "-735.056 -186.37176744186047",
          group: -18,
        },
        {
          text: "Input Value 1",
          color: "white",
          shape: "Input",
          key: 2,
          loc: "-735.056 -96.37176744186047",
          group: -18,
        },
        {
          text: "Process 1",
          color: "white",
          shape: "Process",
          key: 3,
          loc: "-735.056 -6.37176744186047",
          group: -18,
        },
        {
          text: "Input Value 2",
          color: "white",
          shape: "Input",
          key: 4,
          loc: "-735.056 88.62823255813953",
          group: -18,
        },
        {
          text: "Decision 1",
          color: "white",
          shape: "Decision",
          key: 5,
          loc: "-735.056 188.62823255813953",
          group: -18,
        },
        {
          text: "Output Value 1",
          color: "white",
          shape: "Input",
          key: 6,
          loc: "-735.056 303.6282325581395",
          group: -18,
        },
        {
          text: "Output Value 2",
          color: "white",
          shape: "Input",
          key: 7,
          loc: "-490.05600000000004 188.62823255813953",
          group: -18,
        },
        {
          text: "End",
          color: "white",
          shape: "Start",
          key: 8,
          loc: "-490.05600000000004 303.6282325581395",
          group: -18,
        },
        {
          key: "0",
          color: "white",
          text: "",
          shape: "Initial State",
          loc: "-212.5 -169.65692406149245",
          group: -24,
        },
        {
          key: "12",
          color: "white",
          text: "State-Box",
          shape: "State Box",
          loc: "-212.5 -43.663629279623635",
          group: -24,
        },
        {
          key: "22",
          color: "white",
          text: "Condition",
          shape: "Guard",
          loc: "53 -43.663629279623635",
          group: -24,
        },
        {
          key: "32",
          color: "white",
          text: "",
          shape: "EndState",
          loc: "53 120.00003985518194",
          group: -24,
        },
        {
          key: "02",
          color: "white",
          text: "Block",
          shape: "Block",
          loc: "331.71 -127.49148082838062",
          group: -25,
        },
        {
          text: "New Node",
          color: "white",
          key: -14,
          loc: "331.71 -1.4981860465118046",
          group: -25,
        },
        {
          text: "New Node",
          color: "white",
          key: -15,
          loc: "331.71 127.50851917161938",
          group: -25,
        },
        {
          text: "New Node",
          color: "white",
          key: -16,
          loc: "331.71 244.7470954224654",
          group: -25,
        },
        {
          text: "New Node",
          color: "white",
          key: -17,
          loc: "551.71 -1.4981860465118046",
          group: -25,
        },
        {
          text: "A Flow Chart Template",
          isGroup: true,
          color: "dodgerblue",
          key: -18,
        },
        {
          key: "03",
          color: "white",
          text: "",
          shape: "Initial State",
          loc: "-263.43 275.4130759385076",
          group: -23,
        },
        {
          key: "122",
          color: "white",
          text: "State-Box",
          shape: "State Box",
          loc: "-138.43 275.4130759385076",
          group: -23,
        },
        {
          key: "123",
          color: "white",
          text: "State-Box",
          shape: "State Box",
          loc: "1.5699999999999932 275.4130759385076",
          group: -23,
        },
        {
          key: "322",
          color: "white",
          text: "",
          shape: "EndState",
          loc: "126.5 275.41307593850746",
          group: -23,
        },
        {
          text: "Sub-State System",
          isGroup: true,
          color: "dodgerblue",
          key: -23,
          group: -24,
        },
        {
          text: "A State Chart Template",
          isGroup: true,
          color: "dodgerblue",
          key: -24,
        },
        {
          text: "A Block Diagram Template",
          isGroup: true,
          color: "dodgerblue",
          key: -25,
        },
      ],
      linkDataArray: [
        {
          from: 1,
          to: 2,
          key: -1,
          text: "",
          points: [-735.056, -162.6741867494805, -735.056, -112.9877029582179],
        },
        {
          from: 2,
          to: 3,
          key: -2,
          text: "",
          points: [-735.056, -79.75583192550305, -735.056, -22.987702958217895],
        },
        {
          from: 3,
          to: 4,
          key: -3,
          text: "",
          points: [-735.056, 10.244168074496955, -735.056, 72.0122970417821],
        },
        {
          from: 4,
          to: 5,
          key: -4,
          text: "",
          points: [-735.056, 105.24416807449695, -735.056, 156.39636152542468],
        },
        {
          from: 5,
          to: 7,
          key: -5,
          text: "",
          points: [
            -635.1123049316407, 188.62823255813953, -569.1239206848145,
            188.62823255813953,
          ],
        },
        {
          from: 5,
          to: 6,
          key: -6,
          text: "",
          points: [-735.056, 220.86010359085438, -735.056, 287.0122970417822],
        },
        {
          from: 7,
          to: 8,
          key: -7,
          text: "",
          points: [
            -490.05600000000004, 205.24416807449694, -490.05600000000004,
            279.9306518657596,
          ],
        },
        {
          from: 6,
          to: 8,
          key: -8,
          text: "",
          points: [
            -655.9880793151856, 303.62823255813953, -523.0985809815872,
            303.62823255813953,
          ],
        },
        {
          from: "0",
          to: "12",
          fromPort: "B",
          toPort: "T",
          key: -9,
          points: [
            -212.5, -139.587156619632, -212.5, -131.587156619632, -212.5,
            -93.04098854513502, -212.5, -63.04098854513502,
          ],
          segmentOffset: "-0.000038949022339807016 37.777903090782274",
          text: "Transition\nState X",
        },
        {
          from: "12",
          to: "22",
          fromPort: "R",
          toPort: "L",
          key: -10,
          points: [
            -161.80266316490855, -43.663629279623635, -153.80266316490855,
            -43.663629279623635, -69.64056396484375, -43.663629279623635,
            -39.64056396484375, -43.663629279623635,
          ],
          segmentOffset: "2.042097238826841 26.54664092039114",
          text: "Transition\nState Y",
        },
        {
          from: "22",
          to: "32",
          fromPort: "B",
          toPort: "T",
          key: -11,
          points: [
            53, -11.431758246908785, 53, -3.4317582469087853, 53,
            59.930272413321475, 53, 89.93027241332148,
          ],
          segmentOffset: "1.0210096703910985 38.798990659218134",
          text: "Transition\nState  Z",
        },
        {
          from: "02",
          to: -14,
          fromPort: "B",
          toPort: "T",
          key: -12,
          points: [
            331.71, -108.11412156286923, 331.71, -100.11412156286923, 331.71,
            -50.87554531202319, 331.71, -20.875545312023192,
          ],
          segmentOffset: "-1.0210680939245549 33.69386440921767",
          text: "Transition",
        },
        {
          from: -14,
          to: -17,
          fromPort: "R",
          toPort: "L",
          key: -13,
          points: [
            385.0370212833336, -1.4981860465118046, 393.0370212833336,
            -1.4981860465118046, 468.38297871666623, -1.4981860465118046,
            498.38297871666623, -1.4981860465118046,
          ],
          segmentOffset: "3.0631069092180496 11.23130111941338",
          text: "Transition",
        },
        {
          from: -17,
          to: -15,
          fromPort: "B",
          toPort: "R",
          key: -14,
          points: [
            551.71, 17.87917321899959, 551.71, 25.87917321899959,
            415.03702128333373, 127.50851917161938, 385.03702128333373,
            127.50851917161938,
          ],
          segmentOffset: "0.08415381039017866 -29.201890103123617",
          text: "Transition",
        },
        {
          from: -15,
          to: -16,
          fromPort: "B",
          toPort: "T",
          key: -15,
          points: [
            331.71, 146.88587843713077, 331.71, 154.88587843713077, 331.71,
            195.36973615695402, 331.71, 225.36973615695402,
          ],
          segmentOffset: "1.021009670391095 -38.79883486312883",
          text: "Transition",
        },
        {
          from: "03",
          to: "122",
          fromPort: "R",
          toPort: "L",
          key: -16,
          points: [
            -233.36023255813956, 275.4130759385076, -225.36023255813956,
            275.4130759385076, -219.12733683509148, 275.4130759385075,
            -189.12733683509148, 275.4130759385075,
          ],
          segmentOffset: "-0.881986541748006 -9.701986541747942",
          text: "X",
        },
        {
          from: "122",
          to: "123",
          fromPort: "R",
          toPort: "L",
          key: -17,
          points: [
            -87.73266316490854, 275.4130759385075, -79.73266316490854,
            275.4130759385075, -79.12733683509148, 275.4130759385075,
            -49.127336835091484, 275.4130759385075,
          ],
          segmentOffset: "1.7639730834961256 -11.465959625244068",
          text: "Y",
        },
        {
          from: "123",
          to: "322",
          fromPort: "R",
          toPort: "L",
          key: -18,
          points: [
            52.26733683509144, 275.4130759385076, 60.26733683509144,
            275.4130759385076, 66.43023255813955, 275.4130759385076,
            96.43023255813955, 275.4130759385076,
          ],
          segmentOffset: "2.64602691650407 -11.465959625244068",
          text: "Z",
        },
        {
          from: "12",
          to: -23,
          fromPort: "B",
          toPort: "TLM",
          key: -19,
          points: [
            -212.50000000000003, -24.28627001411224, -212.50000000000003,
            -16.28627001411224, -210.38586046511625, 203.84330849664698,
            -210.38586046511625, 233.84330849664698,
          ],
          segmentOffset: "-29.333008399872337 -24.0280786419482",
          text: "Input",
        },
        {
          from: -23,
          to: "22",
          fromPort: "R",
          toPort: "R",
          key: -20,
          points: [
            168.0697674418605, 275.4130759385075, 176.0697674418605,
            275.4130759385075, 175.64056396484375, -43.663629279623635,
            145.64056396484375, -43.663629279623635,
          ],
          segmentOffset: "1.5688801406938264 -29.077025313300048",
          text: "Output",
        },
      ],
      modelData: {
        canRelink: true,
      },
      selectedData: null,
      skipsDiagramUpdate: false,
    };
    // init maps
    this.mapNodeKeyIdx = new Map<go.Key, number>();
    this.mapLinkKeyIdx = new Map<go.Key, number>();
    this.refreshNodeIndex(this.state.nodeDataArray);
    this.refreshLinkIndex(this.state.linkDataArray);
    // bind handler methods
    this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  /**
   * Update map of node keys to their index in the array.
   */
  private refreshNodeIndex(nodeArr: Array<go.ObjectData>) {
    this.mapNodeKeyIdx.clear();
    nodeArr.forEach((n: go.ObjectData, idx: number) => {
      this.mapNodeKeyIdx.set(n.key, idx);
    });
  }

  /**
   * Update map of link keys to their index in the array.
   */
  private refreshLinkIndex(linkArr: Array<go.ObjectData>) {
    this.mapLinkKeyIdx.clear();
    linkArr.forEach((l: go.ObjectData, idx: number) => {
      this.mapLinkKeyIdx.set(l.key, idx);
    });
  }

  public handleDiagramEvent(e: go.DiagramEvent) {
    const name = e.name;
    switch (name) {
      case "ChangedSelection": {
        const sel = e.subject.first();
        this.setState(
          produce((draft: AppState) => {
            if (sel) {
              if (sel instanceof go.Node) {
                const idx = this.mapNodeKeyIdx.get(sel.key);
                if (idx !== undefined && idx >= 0) {
                  const nd = draft.nodeDataArray[idx];
                  draft.selectedData = nd;
                }
              } else if (sel instanceof go.Link) {
                const idx = this.mapLinkKeyIdx.get(sel.key);
                if (idx !== undefined && idx >= 0) {
                  const ld = draft.linkDataArray[idx];
                  draft.selectedData = ld;
                }
              }
            } else {
              draft.selectedData = null;
            }
          })
        );
        break;
      }
      default:
        break;
    }
  }

  public handleModelChange(obj: go.IncrementalData) {
    const insertedNodeKeys = obj.insertedNodeKeys;
    const modifiedNodeData = obj.modifiedNodeData;
    const removedNodeKeys = obj.removedNodeKeys;
    const insertedLinkKeys = obj.insertedLinkKeys;
    const modifiedLinkData = obj.modifiedLinkData;
    const removedLinkKeys = obj.removedLinkKeys;
    const modifiedModelData = obj.modelData;

    // maintain maps of modified data so insertions don't need slow lookups
    const modifiedNodeMap = new Map<go.Key, go.ObjectData>();
    const modifiedLinkMap = new Map<go.Key, go.ObjectData>();

    this.setState((prevState: AppState) => {
      return produce((draft: AppState) => {
        let narr = draft.nodeDataArray;
        if (modifiedNodeData) {
          modifiedNodeData.forEach((nd: go.ObjectData) => {
            modifiedNodeMap.set(nd.key, nd);
            const idx = this.mapNodeKeyIdx.get(nd.key);
            if (idx !== undefined && idx >= 0) {
              narr[idx] = nd;
              if (draft.selectedData && draft.selectedData.key === nd.key) {
                draft.selectedData = nd;
              }
            }
          });
        }
        if (insertedNodeKeys) {
          insertedNodeKeys.forEach((key: go.Key) => {
            const nd = modifiedNodeMap.get(key);
            const idx = this.mapNodeKeyIdx.get(key);
            if (nd && idx === undefined) {
              // nodes won't be added if they already exist
              this.mapNodeKeyIdx.set(nd.key, narr.length);
              narr.push(nd);
            }
          });
        }
        if (removedNodeKeys) {
          narr = narr.filter((nd: go.ObjectData) => {
            if (removedNodeKeys.includes(nd.key)) {
              return false;
            }
            return true;
          });
          draft.nodeDataArray = narr;
          this.refreshNodeIndex(narr);
        }

        let larr = draft.linkDataArray;
        if (modifiedLinkData) {
          modifiedLinkData.forEach((ld: go.ObjectData) => {
            modifiedLinkMap.set(ld.key, ld);
            const idx = this.mapLinkKeyIdx.get(ld.key);
            if (idx !== undefined && idx >= 0) {
              larr[idx] = ld;
              if (draft.selectedData && draft.selectedData.key === ld.key) {
                draft.selectedData = ld;
              }
            }
          });
        }
        if (insertedLinkKeys) {
          insertedLinkKeys.forEach((key: go.Key) => {
            const ld = modifiedLinkMap.get(key);
            const idx = this.mapLinkKeyIdx.get(key);
            if (ld && idx === undefined) {
              // links won't be added if they already exist
              this.mapLinkKeyIdx.set(ld.key, larr.length);
              larr.push(ld);
            }
          });
        }
        if (removedLinkKeys) {
          larr = larr.filter((ld: go.ObjectData) => {
            if (removedLinkKeys.includes(ld.key)) {
              return false;
            }
            return true;
          });
          draft.linkDataArray = larr;
          this.refreshLinkIndex(larr);
        }
        // handle model data changes, for now just replacing with the supplied object
        if (modifiedModelData) {
          draft.modelData = modifiedModelData;
        }
        draft.skipsDiagramUpdate = true; // the GoJS model already knows about these updates
      });
    });
  }
  public handleInputChange(path: string, value: string, isBlur: boolean) {
    this.setState(
      produce((draft: AppState) => {
        const data = draft.selectedData as go.ObjectData; // only reached if selectedData isn't null
        data[path] = value;
        if (isBlur) {
          const key = data.key;
          if (key < 0) {
            // negative keys are links
            const idx = this.mapLinkKeyIdx.get(key);
            if (idx !== undefined && idx >= 0) {
              draft.linkDataArray[idx] = data;
              draft.skipsDiagramUpdate = false;
            }
          } else {
            const idx = this.mapNodeKeyIdx.get(key);
            if (idx !== undefined && idx >= 0) {
              draft.nodeDataArray[idx] = data;
              draft.skipsDiagramUpdate = false;
            }
          }
        }
      })
    );
  }
  public render() {
    return (
      <div>
        <DiagramWrapper
          nodeDataArray={this.state.nodeDataArray}
          linkDataArray={this.state.linkDataArray}
          modelData={this.state.modelData}
          skipsDiagramUpdate={this.state.skipsDiagramUpdate}
          onDiagramEvent={this.handleDiagramEvent}
          onModelChange={this.handleModelChange}
        />
      </div>
    );
  }
}

export default App;
