export class PriceCheckedEvent {
  constructor(
    public readonly productId: string,
    public readonly snapshotId: string,
    public readonly price: number | null,
    public readonly inStock: boolean,
  ) {}
}
