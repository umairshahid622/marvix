import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';





@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {

  constructor(
    private readonly http: HttpClient,
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    let token = localStorage.getItem('access_token')
    console.log("access_token:", token);

    this.http.get('http://45.85.250.231:8000/api/user/me').subscribe((resposne) => {
      console.log("User" ,resposne);
    })




    this.tenderMinValueForm = this.formBuilder.group({
      tenderMinValue: [null, Validators.required]
    })

    this.tenderMaxValueForm = this.formBuilder.group({
      tenderMaxValue: [null, Validators.required]
    })

    this.updateCpvCodesForm = this.formBuilder.group({
      updatedCpvCodes: [[], Validators.required]
    })
    this.updateLocationsForm = this.formBuilder.group({
      updatedLocations: [[], Validators.required]
    })
    this.updateKeywordsForm = this.formBuilder.group({
      updatedKeywords: [[], Validators.required]
    })
    this.updateCompetitorsForm = this.formBuilder.group({
      updatedCompetitors: [[], Validators.required]
    })

  }



  data: any = {
    companyId: "af7c1fe6-d669-414e-b066-e9733f0de7a8",
    companyName: "Test Company pvt",
    email: "testmail@gmail.com",
    name: "testn name",
    tenderMinValue: 5,
    tenderMaxValue: 200,
    cpvCodes: ["10000", "20000", "30000", "40000", "50000"],
    keywords: ["keyword-1", "keyword-2", "keyword-3"],
    locations: ["location-1", "location-2", "location-3"],
    competitors: ["competitor-1", "competitor-2", "competitor-3"]
  }


  tender_min_value_update_visible: boolean = false;
  tender_min_value_delete_visible: boolean = false;

  tender_max_value_update_visible: boolean = false;
  tender_max_value_delete_visible: boolean = false;

  cpv_codes_update_visible: boolean = false;
  cpv_codes_delete_visible: boolean = false;

  keywords_update_visible: boolean = false;
  keywords_delete_visible: boolean = false;

  competitors_update_visible: boolean = false;
  competitors_delete_visible: boolean = false;

  locations_update_visible: boolean = false;
  locations_delete_visible: boolean = false;


  showTenderMinValueUpdateDialog() {
    this.tender_min_value_update_visible = true;
  }
  showTenderMinValueDeleteDialog() {
    this.tender_min_value_delete_visible = true;
  }

  showTenderMaxValueUpdateDialog() {
    this.tender_max_value_update_visible = true;
  }
  showTenderMaxValueDeleteDialog() {
    this.tender_max_value_delete_visible = true;
  }

  showCpvCodeUpdateDialog() {
    this.cpv_codes_update_visible = true;
  }
  showCpvCodeDeleteDialog() {
    this.cpv_codes_delete_visible = true;
  }

  showCompetitorsUpdateDialog() {
    this.competitors_update_visible = true;
  }
  showCompetitorsDeleteDialog() {
    this.competitors_delete_visible = true;
  }

  showLocationsUpdateDialog() {
    this.locations_update_visible = true;
  }
  showLocationsDeleteDialog() {
    this.locations_delete_visible = true;
  }

  showKeywordsUpdateDialog() {
    this.keywords_update_visible = true;
  }
  showKeywordsDeleteDialog() {
    this.keywords_delete_visible = true;
  }

  // ======================== Forms ========================


  tenderMinValueForm: FormGroup = new FormGroup({
    tenderMinValue: new FormControl()
  })
  tenderMaxValueForm: FormGroup = new FormGroup({
    tenderMaxValue: new FormControl()
  })

  updateCpvCodesForm: FormGroup = new FormGroup({
    updatedCpvCodes: new FormControl()
  })

  updateLocationsForm: FormGroup = new FormGroup({
    updatedLocations: new FormControl()
  })

  updateKeywordsForm: FormGroup = new FormGroup({
    updatedKeywords: new FormControl()
  })

  updateCompetitorsForm: FormGroup = new FormGroup({
    updatedCompetitors: new FormControl()
  })

  onTenderMinValueSubmit() {
    console.log("Tender Min Value", this.tenderMinValueForm.value);
  }



  onTenderMaxValueSubmit() {
    console.log("Tender Max Value", this.tenderMaxValueForm.value);
  }
  onUpdateCpvCodesSubmit() {
    console.log("CPV Codes", this.updateCpvCodesForm.value);
  }

  onUpdateLocationsSubmit() {
    console.log("Locations", this.updateLocationsForm.value);
  }
  onUpdateKeywordsSubmit() {
    console.log("keywords", this.updateKeywordsForm.value);
  }

  onUpdateCompetitorsSubmit() {
    console.log("Competitors", this.updateCompetitorsForm.value);
  }

}
