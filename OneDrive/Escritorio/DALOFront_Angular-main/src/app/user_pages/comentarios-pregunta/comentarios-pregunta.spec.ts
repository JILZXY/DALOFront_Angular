import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosPregunta } from './comentarios-pregunta';

describe('ComentariosPregunta', () => {
  let component: ComentariosPregunta;
  let fixture: ComponentFixture<ComentariosPregunta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComentariosPregunta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentariosPregunta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
