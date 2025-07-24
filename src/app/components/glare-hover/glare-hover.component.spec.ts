import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlareHoverComponent } from './glare-hover.component';

describe('GlareHoverComponent', () => {
  let component: GlareHoverComponent;
  let fixture: ComponentFixture<GlareHoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlareHoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlareHoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
