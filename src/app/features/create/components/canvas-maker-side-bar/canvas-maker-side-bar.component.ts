import { Component } from '@angular/core';
import { CanvasButtonComponent } from '../../../../shared/canvas-button/canvas-button.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-canvas-maker-side-bar',
  standalone: true,
  imports: [
    CanvasButtonComponent,
    ColorPickerComponent,
    MatSliderModule
  ],
  templateUrl: './canvas-maker-side-bar.component.html'
})
export class CanvasMakerSideBarComponent {

}
