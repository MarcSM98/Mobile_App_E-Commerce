import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddReviewBuyerPage } from './add-review-buyer.page';

describe('AddReviewBuyerPage', () => {
  let component: AddReviewBuyerPage;
  let fixture: ComponentFixture<AddReviewBuyerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReviewBuyerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddReviewBuyerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
