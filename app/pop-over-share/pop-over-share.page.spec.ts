import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopOverSharePage } from './pop-over-share.page';

describe('PopOverSharePage', () => {
  let component: PopOverSharePage;
  let fixture: ComponentFixture<PopOverSharePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopOverSharePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopOverSharePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
