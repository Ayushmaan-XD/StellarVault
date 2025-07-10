import mongoose from "mongoose"

export interface IContainer extends mongoose.Document {
  containerId: string
  zone: string
  width: number
  depth: number
  height: number
  maxWeight: number
  currentWeight: number
  itemCount: number
  utilization: number
}

const ContainerSchema = new mongoose.Schema<IContainer>(
  {
    containerId: {
      type: String,
      required: [true, "Please provide a container ID"],
      unique: true,
    },
    zone: {
      type: String,
      required: [true, "Please provide a zone"],
    },
    width: {
      type: Number,
      required: [true, "Please provide width"],
      min: [0, "Width must be positive"],
    },
    depth: {
      type: Number,
      required: [true, "Please provide depth"],
      min: [0, "Depth must be positive"],
    },
    height: {
      type: Number,
      required: [true, "Please provide height"],
      min: [0, "Height must be positive"],
    },
    maxWeight: {
      type: Number,
      required: [true, "Please provide maximum weight"],
      min: [0, "Maximum weight must be positive"],
    },
    currentWeight: {
      type: Number,
      default: 0,
      min: [0, "Current weight must be positive"],
    },
    itemCount: {
      type: Number,
      default: 0,
      min: [0, "Item count must be positive"],
    },
    utilization: {
      type: Number,
      default: 0,
      min: [0, "Utilization must be between 0 and 100"],
      max: [100, "Utilization must be between 0 and 100"],
    },
  },
  { timestamps: true },
)

// Virtual for calculating volume
ContainerSchema.virtual("volume").get(function () {
  return this.width * this.depth * this.height
})

// Virtual for calculating available space
ContainerSchema.virtual("availableSpace").get(function () {
  return this.volume * (1 - this.utilization / 100)
})

// Virtual for calculating available weight
ContainerSchema.virtual("availableWeight").get(function () {
  return this.maxWeight - this.currentWeight
})

export default mongoose.models.Container || mongoose.model<IContainer>("Container", ContainerSchema)
