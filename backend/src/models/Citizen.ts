import mongoose, { Document, Schema } from "mongoose";

export interface ICitizen extends Document {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  nationality: string;
  passportNumber: string;
  passportIssueDate: Date;
  uniqueId: string;
  createdAt: Date;
  updatedAt: Date;
}

const CitizenSchema = new Schema<ICitizen>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
      enum: [
        "Austria",
        "Belgium",
        "Bulgaria",
        "Croatia",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Estonia",
        "Finland",
        "France",
        "Germany",
        "Greece",
        "Hungary",
        "Ireland",
        "Italy",
        "Latvia",
        "Lithuania",
        "Luxembourg",
        "Malta",
        "Netherlands",
        "Poland",
        "Portugal",
        "Romania",
        "Slovakia",
        "Slovenia",
        "Spain",
        "Sweden",
      ],
    },
    passportNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string): boolean {
          return !!(v && v.length === 9);
        },
        message: "Ο αριθμός διαβατηρίου πρέπει να είναι ακριβώς 9 χαρακτήρες",
      },
    },
    passportIssueDate: {
      type: Date,
      required: true,
    },
    uniqueId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

CitizenSchema.pre<ICitizen>("save", function (next) {
  if (!this.uniqueId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5);
    this.uniqueId = `CIT-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

export const Citizen = mongoose.model<ICitizen>("Citizen", CitizenSchema);
