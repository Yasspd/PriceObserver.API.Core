export class PaginationMetaDto {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly total: number,
  ) {}

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }
}
