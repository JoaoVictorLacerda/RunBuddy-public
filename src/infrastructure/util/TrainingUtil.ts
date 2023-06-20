export default class TrainingUtil{

    public static putDateFilters(isActive:boolean){
        return isActive ? { $gte: new Date() } : { $lt: new Date() }
    }

    public static paginate(list:any[],page:number, size:number){
        if(page===0) page=1
        const start = ((page * size) - size); //pega o inicio da paginação 2 * 10 = 20; 20 - 10 = 0
        const end  = page * size; //pega o final da paginação 3 * 10 = 30;
        return list.slice(start, end);
    }
}