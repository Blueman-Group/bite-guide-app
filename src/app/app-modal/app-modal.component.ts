import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-app-modal',
  templateUrl: './app-modal.component.html',
  styleUrls: ['./app-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppModalComponent implements OnInit {
  @Input() infos: any[] = [];
  @Input() name: string = '';
  @Input() title: string = 'Allergene';

  constructor() {}

  ngOnInit() {}
}
