import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAuth extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AuthSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Παρακαλώ εισάγετε έγκυρο email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες"],
    },
  },
  {
    timestamps: true,
  }
);

AuthSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

AuthSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Auth = mongoose.model<IAuth>("Auth", AuthSchema);
