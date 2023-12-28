import { Component } from '@angular/core';
import { CanvasComponent } from './components/canvas/canvas.component';
import { CanvasMakerTextBoxComponent } from './components/canvas-maker-text-box/canvas-maker-text-box.component';
import { TextMakerTextBoxComponent } from './components/text-maker-text-box/text-maker-text-box.component';
import { CanvasMakerSideBarComponent } from './components/canvas-maker-side-bar/canvas-maker-side-bar.component';
import { TextMakerSideBarComponent } from './components/text-maker-side-bar/text-maker-side-bar.component';
import { CreateService } from './create.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CanvasComponent,
    CanvasMakerTextBoxComponent,
    TextMakerTextBoxComponent,
    CanvasMakerSideBarComponent,
    TextMakerSideBarComponent
  ],
  host: {
    '[class]': '"w-screen h-screen flex bg-canvas p-4 box-border overflow-hidden gap-4"'
  },
  templateUrl: './create.component.html'
})
export class CreateComponent {
  constructor(private create: CreateService) {
  }

  get mode() {
    return this.create.mode;
  }
}
