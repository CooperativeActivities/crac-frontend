import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'collapsible-card',
  templateUrl: 'collapsible-card.html',
})
export class CollapsibleCardComponent implements OnInit {
  @Input() shown: Boolean
  visible: Boolean
  constructor() {
  }
  ngOnInit(){
    this.visible = !!this.shown
  }
  toggle(){
    this.visible = !this.visible
  }
}

