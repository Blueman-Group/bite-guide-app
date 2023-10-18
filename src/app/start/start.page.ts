import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { ColorModeService } from '../services/colormode.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class StartPage implements OnInit {
  constructor(
    private storageService: StorageService,
    private databaseService: DatabaseService,
    private router: Router,
    private toastController: ToastController,
    public colorModeService: ColorModeService
  ) {}

  async ngOnInit() {
    //wait until storage is ready
    while (!this.storageService._storageReady) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (!(await this.storageService.checkSetup())) {
      if (!(await this.databaseService.checkArangoConnection())) {
        const toast = await this.toastController.create({
          message: 'Wir können keine Verbindung zur Datenbank aufbauen. Bitte versuche es später erneut.',
          duration: 5000,
          position: 'top',
          color: 'danger',
          icon: 'wifi-outline',
        });
        toast.present();
        return;
      }
      //if not setup load canteens in storage and start setup
      await this.storageService.updateCanteens();
      this.router.navigate(['setup', '1']);
    } else {
      //if setup get favorite canteens, update menus and go to main page
      let favoriteCanteeen = await this.storageService.getFavoriteCanteen();
      if ((await this.storageService.getActualMeals(favoriteCanteeen.canteen._key)).length < 5) {
        await this.storageService.updateMenus(favoriteCanteeen.canteen._key);
      } else {
        this.storageService.updateMenus(favoriteCanteeen.canteen._key).then(() => {
          console.log('Updated meals');
        });
      }
      this.router.navigate(['home/main']);
    }
  }
}
