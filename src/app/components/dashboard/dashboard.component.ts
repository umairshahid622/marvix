import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Table } from 'primeng/table';

interface UserData {
    status: string;
    user: {
        name: string;
        email: string;
        photo: string;
        role: string;
        created_at: string;
        updated_at: string;
        id: string;
    };
}

interface Contract {
    _id: string;
    score: number;
    item: {
        // ... other fields
        accepted?: boolean;
        cpvCodes: string;
    };
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    loading = true;
    userprofile: UserData;
    products: Contract[] = [];
    filteredProducts: Contract[] = [];
    userId: string | null = localStorage.getItem('userId');
    accessToken: string | null = localStorage.getItem('access_token');
    cpvCodeFilter: string = ''; // New property for filter

    @ViewChild('filter') filter!: Table;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        // Fetch user data
        this.loading = true;
        this.http
            .get<UserData>('http://localhost:5000/api/users/me', {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            })
            .subscribe(
                (datauser) => {
                    this.userprofile = datauser;
                    this.loading = false;
                },
                (error) => {
                    console.error('Error fetching user data:', error);
                    this.loading = false;
                }
            );

        this.http
            .get<any>('http://127.0.0.1:5000/api/posts/get_data_by_user_id?skip=0&limit=1000', {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            })
            .subscribe(
                (data) => {
                    this.products = data[0].data.map((contract: Contract) => ({
                        ...contract,
                        item: { ...contract.item, accepted: false },
                    }));
                    this.filteredProducts = [...this.products];
                    this.loading = false;
                },
                (error) => {
                    console.error('Error fetching data:', error);
                    this.loading = false;
                }
            );
    }

    acceptContract(contract: Contract): void {
        contract.item.accepted = true;
    }

    rejectContract(contract: Contract): void {
        contract.item.accepted = false;
    }

    onGlobalFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

        if (filterValue) {
            this.filteredProducts = this.products.filter((contract) =>
                contract.item.cpvCodes.toLowerCase().includes(filterValue)
            );
        } else {
            this.filteredProducts = [...this.products];
        }

        // Reset the table paginator to the first page
        this.filter.first = 0;
    }


    clear(table: Table) {
        table.clear();
        this.filter.filter('', 'global', 'contains');
    }

    highlightMatches(text: string): string {
        if (!this.cpvCodeFilter || !text) {
            return text;
        }

        const regex = new RegExp(this.cpvCodeFilter, 'gi');
        return text.replace(regex, match => `<span class="highlight">${match}</span>`);
    }
}
