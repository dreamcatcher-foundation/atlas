export interface IRuntimeCargo {
  get:
    (key: any) =>any;
  set:
    (key: any, value: any) =>IRuntimeCargo;
  del:
    (key: any) =>IRuntimeCargo;
  save:
    () =>IRuntimeCargo;
  load:
    () =>any;
}