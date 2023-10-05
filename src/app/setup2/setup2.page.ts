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
      let canteen = await this.storageService.getFavoriteCanteen();
      if (canteen.menu.length != 0) {
        canteen.menu = [];
      }
      canteen.menu.push({
        date: new Date().toISOString().substring(0, 10),
        meals: await this.storageService.getMenu(canteen.canteen, new Date()),
      });
      if (canteen.menu.length != 0) {
        document.getElementById('finish_anim')?.classList.add('finish');
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
