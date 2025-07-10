import mongoose from "mongoose"

export interface ICoordinates {
  width: number
  depth: number
  height: number
}

export interface IPosition {
  startCoordinates: ICoordinates
  endCoordinates: ICoordinates
}

export interface IItem extends mongoose.Document {
  itemId: string
  name: string
  width: number
  depth: number
  height: number
  mass: number
  priority: number
  expiryDate: Date | null
  usageLimit: number
  usesLeft: number
  preferredZone: string
  containerId: string
  position: IPosition | null
  isWaste: boolean
  wasteReason: "Expired" | "Out of Uses" | "Damaged" | null
  createdBy: mongoose.Types.ObjectId
}

const CoordinatesSchema = new mongoose.Schema<ICoordinates>({
  width: { type: Number, required: true },
  depth: { type: Number, required: true },
  height: { type: Number, required: true },
})

const PositionSchema = new mongoose.Schema<IPosition>({
  startCoordinates: { type: CoordinatesSchema, required: true },
  endCoordinates: { type: CoordinatesSchema, required: true },
})

const ItemSchema = new mongoose.Schema<IItem>(
  {
    itemId: {
      type: String,
      required: [true, "Please provide an item ID"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [100, "Name cannot be more than 100 characters"],
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
    mass: {
      type: Number,
      required: [true, "Please provide mass"],
      min: [0, "Mass must be positive"],
    },
    priority: {
      type: Number,
      required: [true, "Please provide priority"],
      min: [0, "Priority must be between 0 and 100"],
      max: [100, "Priority must be between 0 and 100"],
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    usageLimit: {
      type: Number,
      required: [true, "Please provide usage limit"],
      min: [0, "Usage limit must be positive"],
    },
    usesLeft: {
      type: Number,
      required: [true, "Please provide uses left"],
      min: [0, "Uses left must be positive"],
    },
    preferredZone: {
      type: String,
      required: [true, "Please provide preferred zone"],
    },
    containerId: {
      type: String,
      required: [true, "Please provide container ID"],
    },
    position: {
      type: PositionSchema,
      default: null,
    },
    isWaste: {
      type: Boolean,
      default: false,
    },
    wasteReason: {
      type: String,
      enum: ["Expired", "Out of Uses", "Damaged", null],
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user ID"],
    },
  },
  { timestamps: true },
)

// Virtual for checking if item is expired
ItemSchema.virtual("isExpired").get(function () {
  if (!this.expiryDate) return false
  return new Date() > this.expiryDate
})

// Virtual for checking if item is out of uses
ItemSchema.virtual("isOutOfUses").get(function () {
  return this.usesLeft <= 0
})

// Pre-save middleware to check if item should be marked as waste
ItemSchema.pre("save", function (next) {
  if (this.isExpired) {
    this.isWaste = true
    this.wasteReason = "Expired"
  } else if (this.isOutOfUses) {
    this.isWaste = true
    this.wasteReason = "Out of Uses"
  }
  next()
})

export default mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema)
