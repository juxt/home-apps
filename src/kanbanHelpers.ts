import { DraggableLocation } from "react-beautiful-dnd";
import { QueryClient } from "react-query";
import { Column as TColumn, useKanbanDataQuery } from "./generated/graphql";
import { TBoard, TCard } from "./types";

export function isDefined<T>(argument: T | undefined): argument is T {
  return argument !== undefined;
}
export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  if (value === null || value === undefined) return false;
  return true;
}

export function distinctBy<T>(array: Array<T>, propertyName: keyof T) {
  return array.filter(
    (e, i) => array.findIndex((a) => a[propertyName] === e[propertyName]) === i
  );
}

export function indexById<T extends { id: string }>(
  array: Array<T>
): { [id: string]: T } {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item.id]: item,
    };
  }, initialValue);
}

export function immutableMove<T>(arr: Array<T>, from: number, to: number) {
  return arr.reduce((prev, current, idx, self) => {
    if (from === to) {
      prev.push(current);
    }
    if (idx === from) {
      return prev;
    }
    if (from < to) {
      prev.push(current);
    }
    if (idx === to) {
      prev.push(self[from]);
    }
    if (from > to) {
      prev.push(current);
    }
    return prev;
  }, [] as Array<T>);
}

function addInArrayAtPosition(array: any, element: any, position: number) {
  const arrayCopy = [...array];
  arrayCopy.splice(position, 0, element);
  return arrayCopy;
}

function removeFromArrayAtPosition(array: any[], position: any) {
  return array.reduce(
    (acc: any, value: any, idx: any) =>
      idx === position ? acc : [...acc, value],
    []
  );
}

function identity(value: any) {
  return value;
}

function when(value: any, predicate = identity) {
  return function callback(callback: (arg0: any) => any) {
    if (predicate(value)) return callback(value);
  };
}

function replaceElementOfArray(array: any[]) {
  return function (options: {
    when: (arg0: any) => any;
    for: (arg0: any) => any;
  }) {
    return array.map((element: any) =>
      options.when(element) ? options.for(element) : element
    );
  };
}

function pickPropOut(object: { [x: string]: any }, prop: string) {
  return Object.keys(object).reduce((obj, key) => {
    return key === prop ? obj : { ...obj, [key]: object[key] };
  }, {});
}

function reorderCardsOnColumn(
  column: TColumn,
  reorderCards: (cards: TCard[]) => TCard[]
): TColumn {
  return { ...column, cards: reorderCards(column.cards.filter(notEmpty)) };
}

function moveColumn(
  board: { columns: any },
  { fromPosition }: any,
  { toPosition }: any
) {
  return {
    ...board,
    columns: immutableMove(board.columns, fromPosition, toPosition),
  };
}

function moveCard(
  board: TBoard,
  { index: fromPosition, droppableId: fromColumnId }: DraggableLocation,
  { index: toPosition, droppableId: toColumnId }: DraggableLocation
) {
  if (!board) return;
  const cols = board.columns.filter(notEmpty).map((col) => {
    return {
      ...col,
      cards: col.cards.filter(notEmpty),
    };
  });
  const sourceColumn = cols.find((column) => column.id === fromColumnId);
  const destinationColumn = cols.find((column) => column.id === toColumnId);

  if (!sourceColumn || !destinationColumn) return board;

  const reorderColumnsOnBoard = (
    reorderColumnsMapper: (col: TColumn) => TColumn
  ) => ({
    ...board,
    columns: cols.map(reorderColumnsMapper),
  });

  if (sourceColumn.id === destinationColumn.id) {
    const reorderedCardsOnColumn = reorderCardsOnColumn(
      sourceColumn,
      (cards: TCard[]) => {
        return immutableMove(cards, fromPosition, toPosition);
      }
    );
    return reorderColumnsOnBoard((column: TColumn) =>
      column.id === sourceColumn.id ? reorderedCardsOnColumn : column
    );
  } else {
    const reorderedCardsOnSourceColumn = reorderCardsOnColumn(
      sourceColumn,
      (cards: TCard[]) => {
        return removeFromArrayAtPosition(cards, fromPosition);
      }
    );
    const reorderedCardsOnDestinationColumn = reorderCardsOnColumn(
      destinationColumn,
      (cards: TCard[]) => {
        return addInArrayAtPosition(
          cards,
          sourceColumn.cards[fromPosition],
          toPosition
        );
      }
    );
    return reorderColumnsOnBoard((column: TColumn) => {
      if (column.id === sourceColumn.id) return reorderedCardsOnSourceColumn;
      if (column.id === destinationColumn.id)
        return reorderedCardsOnDestinationColumn;
      return column;
    });
  }
}

function addColumn(board: { columns: string | any[] }, column: any) {
  return {
    ...board,
    columns: addInArrayAtPosition(board.columns, column, board.columns.length),
  };
}

function removeColumn(board: { columns: any[] }, column: { id: any }) {
  return {
    ...board,
    columns: board.columns.filter(({ id }) => id !== column.id),
  };
}

function changeColumn(
  board: { columns: any },
  column: { id: any },
  newColumn: any
) {
  const changedColumns = replaceElementOfArray(board.columns)({
    when: ({ id }) => id === column.id,
    for: (value: any) => ({ ...value, ...newColumn }),
  });
  return { ...board, columns: changedColumns };
}

function addCard(
  board: { columns: any[] },
  inColumn: { id: any },
  card: any,
  opts = { on: "top" }
) {
  const on = opts.on;
  const columnToAdd = board.columns.find(({ id }) => id === inColumn.id);
  const cards = addInArrayAtPosition(
    columnToAdd.cards,
    card,
    on === "top" ? 0 : columnToAdd.cards.length
  );
  const columns = replaceElementOfArray(board.columns)({
    when: ({ id }) => inColumn.id === id,
    for: (value: any) => ({ ...value, cards }),
  });
  return { ...board, columns };
}

function removeCard(
  board: { columns: any[] },
  fromColumn: { id: any },
  card: { id: any }
) {
  const columnToRemove = board.columns.find(({ id }) => id === fromColumn.id);
  const filteredCards = columnToRemove.cards.filter(
    ({ id }: { id: string }) => card.id !== id
  );
  const columnWithoutCard = { ...columnToRemove, cards: filteredCards };
  const filteredColumns = board.columns.map((column: { id: any }) =>
    fromColumn.id === column.id ? columnWithoutCard : column
  );
  return { ...board, columns: filteredColumns };
}

function changeCard(board: { columns: any[] }, cardId: any, newCard: any) {
  const changedCards = (cards: any) =>
    replaceElementOfArray(cards)({
      when: ({ id }) => id === cardId,
      for: (card: any) => ({ ...card, ...newCard }),
    });

  return {
    ...board,
    columns: board.columns.filter(notEmpty).map((column: { cards: any[] }) => ({
      ...column,
      cards: changedCards(column.cards),
    })),
  };
}

const defaultMutationProps = (queryClient: QueryClient) => ({
  onSettled: () => {
    queryClient.refetchQueries(useKanbanDataQuery.getKey());
  },
});

export {
  defaultMutationProps,
  moveColumn,
  moveCard,
  addColumn,
  removeColumn,
  changeColumn,
  addCard,
  removeCard,
  changeCard,
};
