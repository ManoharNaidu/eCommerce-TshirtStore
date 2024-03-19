class WhereClause{
    constructor(base,bigQ){
        this.base = base;
        this.bigQ = bigQ;
    }

    search(){
        const searchword = this.bigQ.search ? {
            name : {
                $regex : this.bigQ.search,
                $options : "i"
            }
        } : {}
        this.base = this.base.find({...searchword});
        return this;
    }

    filter(){
        const copyQ = {...this.bigQ};

        delete copyQ["search"];
        delete copyQ["page"];
        delete copyQ["limit"];

        // converting json to string to replace the operators
        let StringofCopyQ = JSON.stringify(copyQ);
        StringofCopyQ = StringofCopyQ.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // converting back to json
        const jsonofCopyQ = JSON.parse(StringofCopyQ);
        this.base = this.base.find(jsonofCopyQ);
        return this;
    }

    pager(resultPerPage){
        let currentPage = 1;
        if(this.bigQ.page){
            currentPage = this.bigQ.page;
        }
        const skipVal = resultPerPage * (currentPage - 1);
        this.base = this.base.limit(resultPerPage).skip(skipVal);
        return this;
    }
}

module.exports = WhereClause;