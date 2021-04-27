import { AbstractControl } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from '@ajsf/core';

// TODO: Add this control

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'material-stepper-widget',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialStepperComponent implements OnInit {
  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    this.jsf.initializeControl(this);
  }

  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
  }
}
