import mongoose, { Schema, Document } from "mongoose";
import { ColConfig } from "./models.types";

export interface IColumn extends Document {
  name: string;
  boardId: mongoose.Types.ObjectId;
  order: number;
  jobApplications: mongoose.Types.ObjectId[];
  config?: ColConfig;
  createdAt: Date;
  updatedAt: Date;
}

// Board -> Columns -> JobApplications

const ColumnSchema = new Schema<IColumn>(
  {
    name: {
      type: String,
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    jobApplications: [
      {
        type: Schema.Types.ObjectId,
        ref: "JobApplication",
      },
    ],
    config: {
      color: { type: String },
      icon: { type: String }, // icon identifier, optional
      name: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

delete mongoose.models.Column;

export default mongoose.models.Column ||
  mongoose.model<IColumn>("Column", ColumnSchema);
