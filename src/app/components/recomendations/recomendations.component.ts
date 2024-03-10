// recomendations.component.ts

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-recomendations',
    templateUrl: './recomendations.component.html',
    styleUrls: ['./recomendations.component.scss'],
})
export class RecomendationsComponent implements OnInit {
    customers1: any;
    loading = true;
    userId: string | null = localStorage.getItem('userId');
    accessToken: string | null = localStorage.getItem('access_token');
    @ViewChild('filter') filter!: ElementRef;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.loading = true;
        this.fetchRecommendations();
    }

    fetchRecommendations(): void {
        this.http
            .get<any>('http://localhost:5000/api/users/me', {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                },
            })
            .subscribe(
                (datauser) => {
                    const userEmail = datauser.user.email;
                    const apiUrl = this.getApiUrlBasedOnEmail(userEmail);

                    if (apiUrl) {
                        this.http
                            .get<any[]>(apiUrl, {
                                withCredentials: true,
                                headers: {
                                    'Authorization': `Bearer ${this.accessToken}`,
                                },
                            })
                            .subscribe(
                                (data) => {
                                    this.customers1 = data;
                                    console.log('Data from API:', this.customers1);
                                    this.loading = false;
                                },
                                (error) => {
                                    console.error('Error fetching recommendations:', error);
                                    this.loading = false;
                                }
                            );
                    } else {
                        this.loading = false;
                    }
                },
                (error) => {
                    console.error('Error fetching user data:', error);
                    this.loading = false;
                }
            );
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

    acceptRecommendation(customer: any): void {
        // Implement your logic for accepting the recommendation here
        customer.accepted = true;
    }

    rejectRecommendation(customer: any): void {
        // Implement your logic for rejecting the recommendation here
        customer.accepted = false;
    }
}
