export class EmailDTO {
  readonly message: string;
  readonly to: string;
  readonly from: string;
  readonly timeToLifeSec: number;
}
