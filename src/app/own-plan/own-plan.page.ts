import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-own-plan',
  templateUrl: './own-plan.page.html',
  styleUrls: ['./own-plan.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class OwnPlanPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
