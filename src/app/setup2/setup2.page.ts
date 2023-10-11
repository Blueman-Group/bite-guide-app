import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { StorageCanteen } from '../interfaces/storage-canteen';

@Component({
  selector: 'app-setup2',
  templateUrl: './setup2.page.html',
  styleUrls: ['./setup2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Setup2Page implements OnInit, AfterViewChecked {
  updating = false;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    let navigated = this.router.navigated;
    if (!navigated) {
      this.router.navigate(['']);
    }
  }

  async ngAfterViewChecked() {
    if (!this.updating) {
      this.updating = true;
      let startTime = new Date().getTime();
      let canteen = await this.storageService.getFavoriteCanteen();
      if (!canteen) {
        this.router.navigate(['/']);
        return;
      }
      if (canteen.menu.length != 0) {
        canteen.menu = [];
      }
      console.log('update cateen plan');
      await this.storageService.updateMenus(canteen.canteen._key);
      await this.storageService.setSetup();
      if ((await this.storageService.getFavoriteCanteen()).menu.length != 0) {
        const waitFunction = async () => {
          while (new Date().getTime() - startTime < 3000) {
            // Wait for 100 ms
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        };
        await waitFunction();
        document.getElementById('finish_anim')?.classList.remove('ion-hide');
        document.getElementById('finish_anim')?.classList.add('finish');
        let animstart = new Date().getTime();
        const checkmarkWaitFunction = async () => {
          while (new Date().getTime() - animstart < 1500) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        };
        await checkmarkWaitFunction();
        document.getElementById('checkmark')?.classList.remove('ion-hide');
        startTime = new Date().getTime();
        await waitFunction();
        this.router.navigate(['/home/main']);
      } else {
        this.toastController
          .create({
            message:
              'Es konnten keine Gerichte aktuallisiert werden. Möglicherweise besteht keine Verbindung zum Internet. Bitte versuche es später erneut.',
            duration: 5000,
            position: 'top',
            color: 'danger',
            icon: 'cloud-offline-outline',
          })
          .then(async (toast) => {
            await toast.present();
          });
      }
      this.updating = false;
    }
  }
}
