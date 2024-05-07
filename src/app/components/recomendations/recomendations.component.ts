// recomendations.component.ts

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';


interface ApiCall {
    total_count: number;
    data: [];
}

interface RejectRecommendation {

    message: string
    status: string
}

interface DataByCompetitorName {
    total_count: number,
    isRecomendationAccepted: boolean,
    isRecommendationRejected: boolean,
    data: [
        {
            _id: string
            score: number,
            id: string
            item: {
                parentId: string
                noticeIdentifier: string
                title: string
                description: string
                cpvDescription: string
                cpvDescriptionExpanded: string
                publishedDate: string
                deadlineDate: string
                awardedDate: string
                awardedValue: number,
                awardedSupplier: string
                approachMarketDate: null,
                valueLow: number
                valueHigh: number
                postcode: string,
                coordinates: string
                isSubNotice: true,
                noticeType: string
                noticeStatus: string
                isSuitableForSme: boolean,
                isSuitableForVco: boolean,
                awardedToSme: boolean,
                awardedToVcse: boolean,
                lastNotifableUpdate: string
                organisationName: string
                sector: string
                cpvCodes: string
                cpvCodesExtended: string
                region: string
                regionText: string
                start: string
                end: string
            },
            user_id: string
            SearchCPVCode: string
            createdAt: string
            updatedAt: string
        }
    ]
}


@Component({
    selector: 'app-recomendations',
    templateUrl: './recomendations.component.html',
    styleUrls: ['./recomendations.component.scss'],
    providers: [MessageService]
})
export class RecomendationsComponent implements OnInit {
    // customers1: any;
    loading: boolean = false;
    user: any[];
    competitorNames: any[]
    selectedCompetitorNames: any[]
    userId: string | null = localStorage.getItem('userId');
    accessToken: string | null = localStorage.getItem('access_token');
    @ViewChild('filter') filter!: ElementRef;
    dataByCompetitorName: DataByCompetitorName[] = []

    constructor(private http: HttpClient, private formBuilder: FormBuilder, private messageService: MessageService) {
        this.fetchRecommendations();
    }
    competitorForm: FormGroup = new FormGroup({
        competitor: new FormControl([])
    })


    ngOnInit(): void {
        this.competitorForm = this.formBuilder.group({
            competitor: [[], Validators.required]
        })

        this.recommendationRejectForm = this.formBuilder.group({
            recommendationReject: ['', Validators.required]
        })
    }

    fetchRecommendations(): void {
        this.loading = true
        this.http
            .get<any>('http://45.85.250.231:8000/api/users/me', {
                // withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                },
            })
            .subscribe(
                (datauser) => {
                    // console.log("User", datauser);
                    this.user = datauser
                    this.competitorNames = datauser?.user?.competitors
                    console.log("competitors", this.competitorNames);
                    this.competitorForm.value.competitor.push(...this.competitorNames)
                    this.competitorNames.forEach(async (name: string) => {
                        await new Promise<void>((resolve, reject) => {
                            this.http.get(`http://45.85.250.231:8000/api/posts/get_data_by_competitor_name?Competitor%20Name=${name}`, {
                                headers: {
                                    'Authorization': `Bearer ${this.accessToken}`,
                                }
                            }).subscribe((dataByCompetitorName: DataByCompetitorName) => {
                                if (dataByCompetitorName.total_count !== 0) {
                                    console.log(dataByCompetitorName);
                                    this.dataByCompetitorName.push({ ...dataByCompetitorName, isRecomendationAccepted: false, isRecommendationRejected: false })

                                }
                                resolve();
                            }, (errr) => {
                                console.log("Error In Fetching competitorNamese", errr);
                                reject()
                            }, () => {
                                this.loading = false;
                                console.log(this.dataByCompetitorName);

                            },
                            )
                        })
                    })

                    // this.http
                    //     .get<any[]>("http://45.85.250.231:8000/api/posts/get_data_by_user_id/api_call?skip=0&limit=10", {
                    //         headers: {
                    //             'Authorization': `Bearer ${this.accessToken}`,
                    //         },
                    //     })
                    //     .subscribe(
                    //         (data) => {
                    //             // this.customers1 = data;
                    //             // console.log('Data from API:', this.customers1.data);
                    //             this.loading = false;
                    //         },
                    //         (error) => {
                    //             console.error('Error fetching recommendations:', error);
                    //             this.loading = false;
                    //         }
                    //     );

                    // const userEmail = datauser.user.email;
                    // const apiUrl = this.getApiUrlBasedOnEmail(userEmail);

                    // if (apiUrl) {
                    //     this.http
                    //         .get<any[]>(apiUrl, {
                    //             // withCredentials: true,
                    //             headers: {
                    //                 'Authorization': `Bearer ${this.accessToken}`,
                    //             },
                    //         })
                    //         .subscribe(
                    //             (data) => {
                    //                 this.customers1 = data;
                    //                 console.log('Data from API:', this.customers1);
                    //                 this.loading = false;
                    //             },
                    //             (error) => {
                    //                 console.error('Error fetching recommendations:', error);
                    //                 this.loading = false;
                    //             }
                    //         );
                    // } else {
                    //     this.loading = false;
                    // }
                },
                (error) => {
                    console.error('Error fetching user data:', error);
                    this.loading = false;
                }
            );
    }

    competitorsSubmit() {
        if (this.competitorForm.invalid) {
            // console.log("competitorForm Is Invalid", this.competitorForm.getError('required'));
            console.log("competitorForm Is Invalid", this.competitorForm.get('competitor').hasError('required'));
            return
        }
        this.loading = true

        this.dataByCompetitorName = []
        var data_by_competitor_name: number = 0;
        this.competitorForm.value.competitor.forEach((code: string) => {
            // let dummyCode = "Greenfisher Contracting Ltd";
            data_by_competitor_name++;
            this.http.get(`http://45.85.250.231:8000/api/posts/get_data_by_competitor_name?Competitor%20Name=${code}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                }
            }).subscribe((dataByCompetitorName: DataByCompetitorName) => {
                if (dataByCompetitorName.total_count !== 0) {
                    console.log(dataByCompetitorName);
                    this.dataByCompetitorName.push({ ...dataByCompetitorName, isRecomendationAccepted: false, isRecommendationRejected: false })
                }

            }, (errr) => {
                console.log(errr);

            }, () => {
                this.loading = false;
            },
            )

        })
        console.log("For Each Completed", this.dataByCompetitorName);

    }


    getApiUrlBasedOnEmail(userEmail: string): string | null {
        switch (userEmail) {
            case 'stem@gmail.com':
                return 'http://127.0.0.1:8000/get_STEMtender_data';
            case 'griff@gmail.com':
                return 'http://127.0.0.1:4000/get_GRIFFtender_data';
            case 'spl@gmail.com':
                return 'http://127.0.0.1:2000/get_SPLtender_data';
            default:
                console.error('Unknown user email:', userEmail);
                return null;
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        table.filterGlobal(filterValue, 'contains');

        // Additionally, filter the 'awardedSupplier' column
        if (filterValue) {
            table.filter(filterValue, 'awardedSupplier', 'contains');
        }
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    rejectRecomendationDialogVisible: boolean = false
    rejectRecomendationDialogHeader: string = 'Feedback';


    acceptRecommendation(customer: DataByCompetitorName, index: number): void {
        this.dataByCompetitorName[index].isRecomendationAccepted = !this.dataByCompetitorName[index].isRecomendationAccepted
    }
    recommendationIndex: number = null;

    rejectRecommendation(customer: DataByCompetitorName, index: number): void {
        // Implement your logic for rejecting the recommendation here
        console.log("Rejection Name", customer);
        // this.rejectRecomendationDialogHeader = customer.data[0].item.noticeIdentifier
        this.recommendationIndex = index;

        this.rejectRecomendationDialogVisible = true

        // customer.accepted = false;
    }


    recommendationRejectForm: FormGroup = new FormGroup({
        recommendationReject: new FormControl('')
    })

    onSubmitRejectRecommendation() {
        if (this.recommendationRejectForm.invalid) {
            console.log('recommendationRejectForm is Invalid');
            console.log(this.recommendationRejectForm.hasError('required'));
            console.log(this.recommendationRejectForm.errors);
            return
        }


        // this.rejectRecomendationDialogVisible = false
        let comment: string = this.recommendationRejectForm.value.recommendationReject
        this.http.post('http://45.85.250.231:8000/api/users/feedback', {}, {
            params: {
                comment: comment
            },
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
            }
        }).subscribe((res: RejectRecommendation) => {
            console.log("api/users/feedback", res);
            this.messageService.add({ key: 'tc', severity: res.status, summary: res.status, detail: res.message });
            this.rejectRecomendationDialogVisible = false;
            this.dataByCompetitorName[this.recommendationIndex].isRecommendationRejected = true

        }, (error) => {
            console.log(error);

        }, () => { })
    }
    closeToast() {
        this.messageService.clear('c');
    }

}
