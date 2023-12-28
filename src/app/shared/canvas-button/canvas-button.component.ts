import { Component, Input, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-canvas-button',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  host: {
    '[class]': '"flex items-center gap-3 rounded-xl p-2 select-none cursor-pointer " + (active ? activeClasses : inactiveClasses)'
  },
  templateUrl: './canvas-button.component.html'
})
export class CanvasButtonComponent implements OnInit {
  @Input() content: string = '';
  @Input() src: string = '';
  @Input() active: boolean = true;

  ngOnInit() {
    this.src = `../../../assets/icons/${this.src}`;
  }

  protected readonly activeClasses = 'bg-canvas-button';
  protected readonly inactiveClasses = 'bg-white';
}
