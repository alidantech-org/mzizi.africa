/** What a works item is made of: a bill of quantities. */
export interface EconomyCompositions {
  createdAt: string;
  deletedAt?: string | null;
  goodId: string;
  id: string;
  inputId: string;
  quantity: number;
  unitId: string;
  updatedAt: string;
  version: number;
}
