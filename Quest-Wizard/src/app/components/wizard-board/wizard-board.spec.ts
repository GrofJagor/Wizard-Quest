import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WizardBoard } from './wizard-board';

describe('WizardBoard', () => {
  let component: WizardBoard;
  let fixture: ComponentFixture<WizardBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardBoard],
    }).compileComponents();

    fixture = TestBed.createComponent(WizardBoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
