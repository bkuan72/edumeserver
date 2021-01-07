export class AboutDTO {
    general: {
        gender: string,
        birthday: string,
        locations: string[],
        about: string,
    };
    work: {
        occupation: string,
        skills: string,
        jobs: string
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
            locations: [],
            about: ''
        };
        this.work = {
            occupation: '',
            skills: '',
            jobs: ''
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