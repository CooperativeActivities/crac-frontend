
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'collapsible-card-toggleable',
  templateUrl: 'collapsible-card.html',
})
export class CollapsibleCardToggleableComponent {
  @Input() visible: Boolean
  @Output() onToggle = new EventEmitter<null>();
  constructor() { }
  toggle(){
    this.onToggle.emit()
  }
}

