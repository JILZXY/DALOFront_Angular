import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisRespuestas } from './mis-respuestas';

describe('MisRespuestas', () => {
  let component: MisRespuestas;
  let fixture: ComponentFixture<MisRespuestas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisRespuestas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisRespuestas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
