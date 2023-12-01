import { Component, ComponentFactoryResolver, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { MeallistComponent } from '../meallist/meallist.component';

@Component({
  selector: 'app-dynamic-content',
  templateUrl: './dynamiccontent.component.html',
  styleUrls: ['./dynamiccontent.component.scss'],
  standalone: true,
})
export class DynamicContentComponent implements OnInit, OnChanges {
  @Input() component: any;
  @Input() data: any;

  changed = false;

  constructor(public viewContainerRef: ViewContainerRef) {}

  async ngOnInit() {
    this.viewContainerRef.clear();
    while (!this.data) {
      console.log('waiting for data');
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    console.log(this.data);
    if (this.data.menu != null && this.changed) {
      this.changed = false;
      const componentRef = this.viewContainerRef.createComponent(this.component);
      (<MeallistComponent>componentRef.instance).menus = this.data.menu;
      (<MeallistComponent>componentRef.instance).homePageInstance = this.data.homePageInstance;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['data'] && changes['data'].currentValue != changes['data'].previousValue && changes['data'].previousValue != undefined) {
      if (changes['component'] == undefined) {
        console.log('data changed');
        this.changed = true;
        this.ngOnInit();
      }
    }
  }
}
