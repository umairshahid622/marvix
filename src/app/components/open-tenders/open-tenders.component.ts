import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';



interface User {
  status: string
  user: {
    company_id: string
    company_name: string
    competitors: string[]
    cpv_codes: number[]
    created_at: string
    email: string
    id: string
    keywords: string[]
    location: string[]
    name: string
    photo: string
    recommended_tender_minimum_value: number
    role: string
    tender_maximum_value: number
    tender_minimum_value: number
    updated_at: string
  }
}

@Component({
  selector: 'app-open-tenders',
  templateUrl: './open-tenders.component.html',
  styleUrls: ['./open-tenders.component.scss']

})
export class OpenTendersComponent implements OnInit {

  constructor(
    private readonly http: HttpClient
  ) { }
  // http://45.85.250.231:8000/api/users/me
  // http://45.85.250.231:9000/api/open/get_contracts_keywords_cpv_open
  accessToken: string;
  userProfile: User;
  loading: boolean = false;
  isCrawlerLoading: boolean = false;
  ngOnInit(): void {
    this.accessToken = localStorage.getItem('access_token')
    this.http.get('http://45.85.250.231:8000/api/users/me', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      }
    }).subscribe((res: User) => {
      console.log("Open Tenders", res);
      this.userProfile = res;
      for (let index = 0; index < res.user.keywords.length; index++) {
        this.http.get('http://45.85.250.231:9000/api/open/get_contracts_keywords_cpv_open', {
          // params: {
          //   region: res.user.cpv_codes[index].toString(),
          //   keyword: res.user.keywords[index],
          //   skip: 0,
          //   limit: 10
          // },
          params: {
            region: res.user.cpv_codes[index].toString(),
            keyword: res.user.keywords[index],
            skip: 0,
            limit: 10
          },
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          }
        }).subscribe((res) => {
          console.log(res);

        }, (err) => {
          console.log(err);
        })

      }
    }, (err) => {
      console.log(err);
    })
  }

  updateCrawler() {
    this.isCrawlerLoading = true;
    this.http.post('http://45.85.250.231:9000/api/open/run_crawler_from_db_open', {}, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    }).subscribe((res) => {
      console.log("api/open/run_crawler_from_db_open", res);
      this.isCrawlerLoading = false;
    }, (err) => {
      console.log("api/open/run_crawler_from_db_open", err);
      this.isCrawlerLoading = false;
    })
  }
}
