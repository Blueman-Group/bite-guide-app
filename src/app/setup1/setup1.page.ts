import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Canteen } from '../interfaces/canteen';
import { EventAggregatorService } from '../services/event-aggregator.service';

@Component({
  selector: 'app-setup1',
  templateUrl: './setup1.page.html',
  styleUrls: ['./setup1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class Setup1Page implements OnInit {
  public canteens: Canteen[] = [];
  updating = false;
  document = document;

  constructor(private router: Router, public storageService: StorageService, private eventAggregator: EventAggregatorService) {}

  async ngOnInit() {
    if (!this.eventAggregator.appStarted.getValue()) {
      this.router.navigate(['']);
    }
    await this.waitForStart().then(() => {
      this.storageService.getCanteens().then((canteens) => {
        this.canteens = canteens;
        this.updating = false;
      });
    });
  }

  async waitForStart() {
    while (!this.eventAggregator.appStarted.getValue()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  onSelectChange(eventTarget: any) {
    document.getElementById('nextButton')?.classList?.remove('ion-hide');
    this.storageService.setFavorite(eventTarget.value);
  }
}
