import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulResp } from './consul-resp';

describe('ConsulResp', () => {
  let component: ConsulResp;
  let fixture: ComponentFixture<ConsulResp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsulResp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsulResp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
