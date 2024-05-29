import mongoose from "mongoose";

const { Schema } = mongoose;

const diagramSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed, // This will store the JSON data
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const Diagram =
  mongoose.models.diagrams || mongoose.model("diagrams", diagramSchema);
export default Diagram;
