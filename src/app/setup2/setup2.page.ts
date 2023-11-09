import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { EventAggregatorService } from '../services/event-aggregator.service';

@Component({
  selector: 'app-setup2',
  templateUrl: './setup2.page.html',
  styleUrls: ['./setup2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Setup2Page implements OnInit {
  updating = false;

  constructor(private router: Router, private storageService: StorageService, private toastController: ToastController, private eventAggregator: EventAggregatorService) {}

  async ngOnInit() {
    if (!this.eventAggregator.appStarted.getValue()) {
      this.router.navigate(['']);
    }
    await this.waitForStart().then(async () => {
      await this.startAnim();
    });
  }

  async waitForStart() {
    while (!this.eventAggregator.appStarted.getValue()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  async startAnim() {
    let startTime = new Date().getTime();
    let canteen = await this.storageService.getFavoriteCanteen();
    //if no canteen was set go to main page
    if (!canteen) {
      this.router.navigate(['/'], { skipLocationChange: true });
      return;
    }
    if (canteen.menu.length != 0) {
      canteen.menu = [];
    }
    //update menus of favorite canteen
    await this.storageService.updateMenus(canteen.canteen._key);
    //set setup to true to save that the app was setup
    await this.storageService.setSetup();
    //if the menu is empty there have to be a problem with the connection to the database
    if ((await this.storageService.getFavoriteCanteen()).menu.length == 0) {
      this.toastController
        .create({
          message: 'Es konnten keine Gerichte aktuallisiert werden. Möglicherweise besteht keine Verbindung zum Internet. Bitte versuche es später erneut.',
          duration: 5000,
          position: 'top',
          color: 'danger',
          icon: 'cloud-offline-outline',
        })
        .then(async (toast) => {
          await toast.present();
        });
      return;
    }
    await this.doAnimations(startTime);
    this.router.navigate(['/home/main']);
  }

  /**
   * Wait for a specific time
   * @param startTime Start time of the wait function
   * @param waitTime How long the function should wait
   */
  waitFunction = async (startTime: number, waitTime: number) => {
    while (new Date().getTime() - startTime < waitTime) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  async doAnimations(startOfUpdate: number) {
    //user have to wait 3 seconds to see the animation
    await this.waitFunction(startOfUpdate, 3000);

    //add finish animation
    document.getElementById('finish_anim')?.classList.remove('ion-hide');
    document.getElementById('finish_anim')?.classList.add('finish');

    //another 1.5s wait to see finish animation
    await this.waitFunction(new Date().getTime(), 1000);

    //add checkmark animation
    document.getElementById('checkmark')?.classList.remove('ion-hide');

    //sleep 3s to have no instant change
    await this.waitFunction(new Date().getTime(), 3000);
  }
}
