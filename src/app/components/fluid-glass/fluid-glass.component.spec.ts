import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidGlassComponent } from './fluid-glass.component';

describe('FluidGlassComponent', () => {
  let component: FluidGlassComponent;
  let fixture: ComponentFixture<FluidGlassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FluidGlassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FluidGlassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
