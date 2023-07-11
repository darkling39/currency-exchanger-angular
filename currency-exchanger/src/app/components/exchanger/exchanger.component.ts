import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ICurrency } from 'src/app/models/currency';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-exchanger',
  templateUrl: './exchanger.component.html',
  styleUrls: ['./exchanger.component.css'],
})
export class ExchangerComponent {
  constructor(
    private apiService: ApiService,
    private storage: StorageService
  ) {}

  currencies$: Observable<ICurrency[]> = this.apiService.getAll();
  firstFormGroup!: FormGroup;
  myControl = new FormControl('');

  ngOnInit() {
    this.createForm();

    this.toStorage('lCurrency');
    this.toStorage('rCurrency');

    this.exchange('lValue');
    this.exchange('rValue');
  }
  createForm() {
    this.firstFormGroup = new FormGroup({
      lCurrency: new FormControl(''),
      lValue: new FormControl({ value: 1, disabled: true }, [
        Validators.required,
        Validators.pattern(/^\d+(\.\d+)*$/),
      ]),
      rCurrency: new FormControl(''),
      rValue: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
        Validators.pattern(/^\d+(\.\d+)*$/),
      ]),
    });
  }

  toStorage(curr: string) {
    this.firstFormGroup.get(curr)?.valueChanges.subscribe((change) => {
      if (curr === 'lCurrency') {
        this.storage.leftCurrency = change;
      } else {
        this.storage.rightCurrency = change;
      }
      if (this.storage.leftCurrency && this.storage.rightCurrency) {
        this.firstFormGroup.get('lValue')?.enable();
        this.firstFormGroup.get('rValue')?.enable();
      }
    });
  }

  exchange(val: string) {
    if (val === 'lValue') {
      this.firstFormGroup.get(val)?.valueChanges.subscribe((change) => {
        this.firstFormGroup
          .get('rValue')
          ?.setValue(
            (
              change *
              (this.storage.leftCurrency.rate / this.storage.rightCurrency.rate)
            ).toFixed(2),
            { emitEvent: false }
          );
      });
    } else {
      this.firstFormGroup.get(val)?.valueChanges.subscribe((change) => {
        this.firstFormGroup
          .get('lValue')
          ?.setValue(
            (
              change *
              (this.storage.rightCurrency.rate / this.storage.leftCurrency.rate)
            ).toFixed(2),
            { emitEvent: false }
          );
      });
    }
  }
}
