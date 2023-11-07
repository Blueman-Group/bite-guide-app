import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { ColorModeService } from '../services/colormode.service';
import { EventAggregatorService } from '../services/event-aggregator.service';

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
    public colorModeService: ColorModeService,
    private eventAggregator: EventAggregatorService
  ) {}

  async ngOnInit() {
    //wait until storage is ready
    await this.waitForStorage();
    if (!(await this.storageService.checkSetup())) {
      await this.initialStart();
    } else {
      await this.reload();
    }
    this.eventAggregator.appStarted.next(true);
  }

  private async initialStart() {
    // check if database is reachable
    if (!(await this.ensureDBConnection())) return;
    //if not setup load canteens in storage and start setup
    await this.storageService.updateCanteens();
    this.router.navigate(['setup', '1']);
  }

  private async reload() {
    //if setup get favorite canteen, try to reload menus from db and go to home page
    let favoriteCanteen = await this.storageService.getFavoriteCanteen();
    if (!(await this.storageService.reloadMenuesOfCanteenFromDb(favoriteCanteen.canteen._key))) {
      const toast = await this.toastController.create({
        message: 'Es konnten keine Gerichte aktuallisiert werden. Möglicherweise besteht keine Verbindung zum Internet. Bitte versuche es später erneut.',
        duration: 5000,
        position: 'top',
        color: 'danger',
        icon: 'cloud-offline-outline',
      });
      toast.present();
    }
    this.router.navigate(['home/main']);
  }

  private async ensureDBConnection(): Promise<boolean> {
    if (!(await this.databaseService.checkArangoConnection())) {
      const toast = await this.toastController.create({
        message: 'Wir können keine Verbindung zur Datenbank aufbauen. Bitte versuche es später erneut.',
        duration: 5000,
        position: 'top',
        color: 'danger',
        icon: 'cloud-offline-outline',
      });
      toast.present();
      return false;
    } else {
      return true;
    }
  }

  private async waitForStorage(): Promise<void> {
    while (!this.storageService._storageReady) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
}
