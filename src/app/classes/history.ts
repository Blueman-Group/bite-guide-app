export class HistoryMeal {
  name: string;
  normalPrice: number;
  studentPrice: number;
  imageUrl: string;
  canteenId: string;

  constructor(name: string, normalPrice: number, studentPrice: number, imageUrl: string, canteenId: string) {
    this.name = name;
    this.normalPrice = normalPrice;
    this.studentPrice = studentPrice;
    this.imageUrl = imageUrl;
    this.canteenId = canteenId;
  }
}
