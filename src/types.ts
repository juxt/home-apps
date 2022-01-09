import { KanbanDataQuery, Column as TColumn } from "./generated/graphql";

export type TBoards = NonNullable<KanbanDataQuery["allBoards"]>;
export type TBoard = TBoards[0];
export type TCard = NonNullable<TColumn["cards"][0]>;
