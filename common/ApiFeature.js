class APIfeatures {
    constructor(model, queryString) {
        this.model = model;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.model = this.model.skip(skip).limit(limit)
        return this;
    }
}

module.exports = APIfeatures