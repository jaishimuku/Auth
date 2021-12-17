import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Srdejournals2Component } from './srdejournals2.component';

describe('Srdejournals2Component', () => {
  let component: Srdejournals2Component;
  let fixture: ComponentFixture<Srdejournals2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Srdejournals2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Srdejournals2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
