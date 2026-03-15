"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationMetaDto = void 0;
class PaginationMetaDto {
    page;
    limit;
    total;
    constructor(page, limit, total) {
        this.page = page;
        this.limit = limit;
        this.total = total;
    }
    get totalPages() {
        return Math.max(1, Math.ceil(this.total / this.limit));
    }
}
exports.PaginationMetaDto = PaginationMetaDto;
