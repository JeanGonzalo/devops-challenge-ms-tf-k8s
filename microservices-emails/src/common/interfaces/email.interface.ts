export interface IEmail extends Document {
  message: string;
  to: string;
  from: string;
  timeToLifeSec: number;
}
