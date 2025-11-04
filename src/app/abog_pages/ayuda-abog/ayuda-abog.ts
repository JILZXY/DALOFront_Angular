import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ayuda-abog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ayuda-abog.html',
  styleUrls: ['./ayuda-abog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AyudaAbog { 
}