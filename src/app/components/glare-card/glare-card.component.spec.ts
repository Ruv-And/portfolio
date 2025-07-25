import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlareCardComponent } from './glare-card.component';

describe('GlareCardComponent', () => {
  let component: GlareCardComponent;
  let fixture: ComponentFixture<GlareCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlareCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlareCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
