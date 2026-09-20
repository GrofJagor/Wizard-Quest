import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WizardProfile } from './wizard-profile';

describe('WizardProfile', () => {
  let component: WizardProfile;
  let fixture: ComponentFixture<WizardProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(WizardProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
