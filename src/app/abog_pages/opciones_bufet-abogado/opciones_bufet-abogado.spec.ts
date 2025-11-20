import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesBufetAbogado } from './opciones_bufet-abogado';

describe('OpcionesBufetAbogado', () => {
  let component: OpcionesBufetAbogado;
  let fixture: ComponentFixture<OpcionesBufetAbogado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpcionesBufetAbogado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcionesBufetAbogado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

