import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  accessToken: any;
  ngOnInit(): void {
    this.accessToken = localStorage.getItem('access_token')
    console.log("access_token:", this.accessToken);

    this.http.get('http://45.85.250.231:8000/api/user/me', {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    }).subscribe((resposne) => {
      console.log("User", resposne);
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
    this.deleteCpvCodesForm = this.formBuilder.group({
      deletedCpvCodes: [[], Validators.required]
    })

    this.updateLocationsForm = this.formBuilder.group({
      updatedLocations: [[], Validators.required]
    })
    this.updateLocationsForm = this.formBuilder.group({
      deletedLocations: [[], Validators.required]
    })

    this.updateKeywordsForm = this.formBuilder.group({
      updatedKeywords: [[], Validators.required]
    })
    this.deleteKeywordsForm = this.formBuilder.group({
      deletedKeywords: [[], Validators.required]
    })


    this.updateCompetitorsForm = this.formBuilder.group({
      updatedCompetitors: [[], Validators.required]
    })
    this.deleteCompetitorsForm = this.formBuilder.group({
      deletedCompetitors: [[], Validators.required]
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
  deleteCpvCodesForm: FormGroup = new FormGroup({
    deletedCpvCodes: new FormControl()
  })

  updateLocationsForm: FormGroup = new FormGroup({
    updatedLocations: new FormControl()
  })
  deleteLocationsForm: FormGroup = new FormGroup({
    deletedLocations: new FormControl()
  })

  updateKeywordsForm: FormGroup = new FormGroup({
    updatedKeywords: new FormControl()
  })
  deleteKeywordsForm: FormGroup = new FormGroup({
    deletedKeywords: new FormControl()
  })

  updateCompetitorsForm: FormGroup = new FormGroup({
    updatedCompetitors: new FormControl()
  })
  deleteCompetitorsForm: FormGroup = new FormGroup({
    deletedCompetitors: new FormControl()
  })


  onTenderMinValueSubmit() {
    console.log("Tender Min Value", this.tenderMinValueForm.value);
  }
  onTenderMaxValueSubmit() {
    console.log("Tender Max Value", this.tenderMaxValueForm.value);
  }


  onUpdateCpvCodesSubmit() {
    let updatedCpvCodes: string[] = this.updateCpvCodesForm.value.updatedCpvCodes
    console.log("CPV Codes", updatedCpvCodes);
    this.http.put('http://45.85.250.231:8000/api/users/update_user_cpv_codes',
      {
        updatedCpvCodes,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      }).subscribe(
        (res) => {
          console.log("Response", res);
          this.cpv_codes_update_visible = false
        }, (err) => {
          console.log("Error", err);
          this.cpv_codes_update_visible = false
        },
      )
  }
  onDeleteCpvCodesSubmit() {
    let deletedCpvCodes: string[] = this.deleteCpvCodesForm.value.deletedCpvCodes
    console.log("Deleted CPV Codes", deletedCpvCodes);
  }

  onUpdateLocationsSubmit() {
    let updatedLocations: string[] = this.updateLocationsForm.value.updatedLocations
    console.log("Locations", updatedLocations);

  }
  onDeleteLocationsSubmit() {
    let deletedLocations: string[] = this.deleteLocationsForm.value.deletedLocations
    console.log("Deleted Locations", deletedLocations);
  }

  onUpdateKeywordsSubmit() {
    let updatedKeywords: string[] = this.updateKeywordsForm.value.updatedKeywords
    console.log("keywords", updatedKeywords);
    this.http.put('http://45.85.250.231:8000/api/users/update_user_keywords',
      {
        updatedKeywords,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      }).subscribe(
        (res) => {
          console.log("Response", res);
          this.keywords_update_visible = false
        }, (err) => {
          console.log("Error", err);
          this.keywords_update_visible = false
        },
      )
  }
  onDeleteKeywordsSubmit() {
    let deletedKeywords: string[] = this.deleteKeywordsForm.value.deletedKeywords;
    console.log("Deleted keywords", deletedKeywords);
  }

  onUpdateCompetitorsSubmit() {
    let updatedCompetitors: string[] = this.updateCompetitorsForm.value.updatedCompetitors
    console.log("Competitors", updatedCompetitors);
    this.http.put('http://45.85.250.231:8000/api/users/update_user_competitor_names',
      {
        updatedCompetitors,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        }
      }).subscribe(
        (res) => {
          console.log("Response", res);
          this.competitors_update_visible= false
        }, (err) => {
          console.log("Error", err);
          this.competitors_update_visible = false
        },
      )
  }
  onDeleteCompetitorsSubmit() {
    let deletedCompetitors: string = this.deleteCompetitorsForm.value.deletedCompetitors;
    console.log("Deleted Competitors", deletedCompetitors);
    this.http.delete('http://45.85.250.231:8000/api/users/delete_cpv_code',
      {
        params: {
          deletedCompetitor: deletedCompetitors
        },
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      }).subscribe(
        (res) => {
          console.log("Response", res);
          this.competitors_delete_visible = false
        }, (err) => {
          console.log("Error", err);
          this.competitors_delete_visible = false
        },
      )
  }

}
