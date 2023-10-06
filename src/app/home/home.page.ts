import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,

  imports: [IonicModule],
})
export class HomePage {
  constructor(private databaseService: DatabaseService) {
    this.databaseService
      .getMealsAtDate(new Date(), {
        _key: '2',
        name: 'Mensa Academica',
        location: 'Reichenhainer Str. 55, 09126 Chemnitz',
      })
      .then((meals) => {
        console.log(meals);
      });
  }
}
