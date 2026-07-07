import { toaster } from '@/components/toaster';
import { api } from '@/lib/swagger-client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toCreateMenuDto } from './convert';
import { PdfImportState } from './index.d';

/** アップロード可能なPDFの上限サイズ(10MB) */
const MAX_PDF_SIZE = 10 * 1024 * 1024;

/** APIエラーから表示用メッセージを取り出す */
const extractErrorMessage = (e: unknown, fallback: string): string => {
  const err = e as { error?: { message?: string | string[] } } | undefined;
  const message = err?.error?.message;
  if (Array.isArray(message)) return message.join(' / ');
  return message ?? fallback;
};

/** 選択されたPDFファイルとそのプレビューURLを管理する */
export const usePdfFile = () => {
  const [file, setFile] = useState<File | null>(null);

  // Fileからobject URLを導出する(レンダー中に算出、stateにしない)
  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  // object URLはメモリを保持するため、不要になったら解放する
  useEffect(() => {
    if (!objectUrl) return;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const selectFile = useCallback((selected: File | null) => {
    if (!selected) {
      setFile(null);
      return;
    }
    const isPdf =
      selected.type === 'application/pdf' ||
      selected.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      toaster.create({
        title: 'PDFファイルを選択してください',
        type: 'error',
      });
      return;
    }
    if (selected.size > MAX_PDF_SIZE) {
      toaster.create({
        title: 'ファイルサイズが大きすぎます(上限10MB)',
        type: 'error',
      });
      return;
    }
    setFile(selected);
  }, []);

  return { file, objectUrl, selectFile };
};

type UseHandlerArgs = {
  restaurantId: string;
  file: File | null;
};

export const useHandler = ({ restaurantId, file }: UseHandlerArgs) => {
  const [state, setState] = useState<PdfImportState | null>(null);
  const [parsing, setParsing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /** PDFを解析して確認テーブルの初期状態を作る */
  const handleParse = useCallback(async () => {
    if (!file) {
      toaster.create({ title: 'PDFを選択してください', type: 'error' });
      return;
    }
    setParsing(true);
    try {
      const { data } = await api.menus.menusControllerParsePdf({ file });
      setState({
        rows: data.menus,
        ingredients: data.ingredients,
        unmatchedColumns: data.unmatchedColumns,
      });
    } catch (e) {
      setState(null);
      toaster.create({
        title: extractErrorMessage(
          e,
          'PDFの解析に失敗しました。テキスト埋め込みのアレルゲン表PDFをアップロードしてください。'
        ),
        type: 'error',
      });
    } finally {
      setParsing(false);
    }
  }, [file]);

  /** メニュー名を更新する */
  const updateName = useCallback((rowIndex: number, name: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const rows = prev.rows.map((row, i) =>
        i === rowIndex ? { ...row, name } : row
      );
      return { ...prev, rows };
    });
  }, []);

  /** noteを更新する */
  const updateNote = useCallback((rowIndex: number, note: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const rows = prev.rows.map((row, i) =>
        i === rowIndex ? { ...row, note } : row
      );
      return { ...prev, rows };
    });
  }, []);

  /** セルの判定(含む/接触/なし)を更新する */
  const updateCellStatus = useCallback(
    (
      rowIndex: number,
      ingredientId: string,
      status: 'contains' | 'contact' | 'none'
    ) => {
      setState((prev) => {
        if (!prev) return prev;
        const rows = prev.rows.map((row, i) => {
          if (i !== rowIndex) return row;
          const cells = row.cells.map((cell) =>
            cell.ingredientId === ingredientId ? { ...cell, status } : cell
          );
          return { ...row, cells };
        });
        return { ...prev, rows };
      });
    },
    []
  );

  /** 確認テーブルの内容をDB登録する(既存 POST /menus を再利用) */
  const handleRegister = useCallback(
    async (onSuccess: () => void) => {
      if (!state) return;
      const dto = toCreateMenuDto(restaurantId, state.rows);
      if (dto.menus.length === 0) {
        toaster.create({ title: '登録できるメニューがありません', type: 'error' });
        return;
      }
      setSubmitting(true);
      try {
        const { error } = await api.menus.menusControllerCreate(dto);
        if (error) throw error;
        toaster.create({
          title: `${dto.menus.length}件のメニューを登録しました`,
          type: 'success',
        });
        onSuccess();
      } catch (e) {
        toaster.create({
          title: extractErrorMessage(e, 'メニューの登録に失敗しました'),
          type: 'error',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [restaurantId, state]
  );

  return {
    state,
    parsing,
    submitting,
    handleParse,
    updateName,
    updateNote,
    updateCellStatus,
    handleRegister,
  };
};
