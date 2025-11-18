import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicarPregunta } from './publicar-pregunta';

describe('PublicarPregunta', () => {
  let component: PublicarPregunta;
  let fixture: ComponentFixture<PublicarPregunta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicarPregunta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicarPregunta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
