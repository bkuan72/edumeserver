export class FriendListDTO {
    id: string;
    user_id: string;
    name: string;
    avatar: string;
    since: string;
    constructor () {
        this.id = '';
        this.user_id = '';
        this.name = '';
        this.avatar = '';
        this.since = '';
    }
}