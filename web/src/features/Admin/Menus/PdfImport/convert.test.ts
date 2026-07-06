import { EditableMenuRow, toCreateMenuDto } from './convert';

const cell = (
  ingredientId: string,
  ingredientName: string,
  status: 'contains' | 'contact' | 'none'
) => ({ ingredientId, ingredientName, status });

describe('toCreateMenuDto', () => {
  it('containsのアレルゲンのみをingredientIdsに含める', () => {
    const rows: EditableMenuRow[] = [
      {
        name: 'カレー',
        cells: [
          cell('id-egg', '卵', 'contains'),
          cell('id-milk', '乳', 'contact'),
          cell('id-wheat', '小麦', 'none'),
        ],
      },
    ];

    const dto = toCreateMenuDto('rest-1', rows);

    expect(dto.restaurantId).toBe('rest-1');
    expect(dto.menus).toHaveLength(1);
    expect(dto.menus[0].ingredientIds).toEqual(['id-egg']);
  });

  it('noteをそのまま引き継ぐ', () => {
    const rows: EditableMenuRow[] = [
      {
        name: 'カレー',
        note: '調理器具・製造ライン共有のため接触の可能性: 乳',
        cells: [cell('id-egg', '卵', 'contains')],
      },
    ];

    const dto = toCreateMenuDto('rest-1', rows);

    expect(dto.menus[0].note).toBe(
      '調理器具・製造ライン共有のため接触の可能性: 乳'
    );
  });

  it('空のnoteはundefinedにする', () => {
    const rows: EditableMenuRow[] = [
      { name: 'カレー', note: '   ', cells: [] },
    ];

    const dto = toCreateMenuDto('rest-1', rows);

    expect(dto.menus[0].note).toBeUndefined();
  });

  it('名前が空の行は除外する', () => {
    const rows: EditableMenuRow[] = [
      { name: '  ', cells: [cell('id-egg', '卵', 'contains')] },
      { name: 'カレー', cells: [] },
    ];

    const dto = toCreateMenuDto('rest-1', rows);

    expect(dto.menus).toHaveLength(1);
    expect(dto.menus[0].name).toBe('カレー');
  });

  it('ingredientIdを持たないセルは無視する', () => {
    const rows: EditableMenuRow[] = [
      {
        name: 'カレー',
        cells: [
          { ingredientName: '謎', status: 'contains' },
          cell('id-egg', '卵', 'contains'),
        ],
      },
    ];

    const dto = toCreateMenuDto('rest-1', rows);

    expect(dto.menus[0].ingredientIds).toEqual(['id-egg']);
  });
});
