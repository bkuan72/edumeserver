export class AboutDTO {
    general: {
        gender: string,
        birthday: string,
        locations: string[]
    };
    work: {
        occupation: string,
        skills: string,
        jobs: {
            company: string,
            date: string
        }[]
    };
    contact: {
        address: string;
        tel: string[];
        websites: string[];
        emails: string[];
    };
    groups: {
        name: string;
        category: string;
        members: string
    }[];
    friends: {
        name: string,
        avatar: string
    }[];

    constructor ( ) {
        this.general = {
            gender: '',
            birthday: '',
            locations: []
        };
        this.work = {
            occupation: '',
            skills: '',
            jobs: []
        };
        this.contact = {
            address: '',
            tel: [],
            websites:[],
            emails:[]
        };
        this.groups = [];
        this.friends = [];
    }
}