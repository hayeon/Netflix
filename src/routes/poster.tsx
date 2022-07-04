export function posterURL(id:string, format?:string) {
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;

} ;

export function poster(id:string, format?:string) {
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;

} ;