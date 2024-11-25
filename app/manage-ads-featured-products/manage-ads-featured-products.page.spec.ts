import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageAdsFeaturedProductsPage } from './manage-ads-featured-products.page';

describe('ManageAdsFeaturedProductsPage', () => {
  let component: ManageAdsFeaturedProductsPage;
  let fixture: ComponentFixture<ManageAdsFeaturedProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdsFeaturedProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageAdsFeaturedProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
