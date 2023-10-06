import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Canteen } from '../interfaces/canteen';

@Component({
  selector: 'app-setup1',
  templateUrl: './setup1.page.html',
  styleUrls: ['./setup1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class Setup1Page implements OnInit, AfterContentChecked {
  constructor(private router: Router, public storageService: StorageService) {}

  public canteens: Canteen[] = [];
  updating = false;
  document = document;

  customPopoverOptions = {
    cssClass: 'setup-popover',
  };

  ngOnInit() {
    let navigated = this.router.navigated;
    if (!navigated) {
      this.router.navigate(['']);
    }
  }

  ngAfterContentChecked() {
    if (this.canteens.length == 0 && !this.updating) {
      this.updating = true;
      this.storageService.getCanteens().then((canteens) => {
        this.canteens = canteens;
        this.updating = false;
      });
    }
  }

  onSelectChange(eventTarget: any) {
    document.getElementById('nextButton')?.classList?.remove('ion-hide');
    this.storageService.setFavorite(eventTarget.value);
  }
}
