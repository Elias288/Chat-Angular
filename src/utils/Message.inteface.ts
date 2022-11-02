export interface Message {
    content: string;
    answer: undefined | Message;
    author: string;
    time: string;
    room: string;
}