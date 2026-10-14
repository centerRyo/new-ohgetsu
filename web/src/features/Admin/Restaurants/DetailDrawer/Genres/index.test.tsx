import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SWRConfig } from 'swr';
import { useForm, useWatch } from 'react-hook-form';
import { FormValues } from '../../index.d';
import Genres from './index';

const genres = [
  { id: 'g1', name: 'ラーメン' },
  { id: 'g2', name: '日本料理' },
  { id: 'g3', name: 'イタリアン' },
];

vi.mock('@/lib/swagger-client', () => ({
  api: {
    genres: {
      genresControllerFindAll: vi.fn(async () => ({ data: genres })),
    },
  },
}));

const Form = ({ defaultGenreId = '' }: { defaultGenreId?: string }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: { name: '', genreId: defaultGenreId, isOpen: true },
  });

  const genreId = useWatch({ control, name: 'genreId' });

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <Genres errors={errors} control={control} />
      <output data-testid='genreId'>{genreId}</output>
      <button type='submit'>submit</button>
    </form>
  );
};

const setup = (props?: { defaultGenreId?: string }) => {
  const user = userEvent.setup();
  render(
    <ChakraProvider value={defaultSystem}>
      <SWRConfig value={{ provider: () => new Map() }}>
        <Form {...props} />
      </SWRConfig>
    </ChakraProvider>
  );
  return user;
};

const findInput = () => screen.findByRole('combobox');

describe('Genres', () => {
  it('入力した文字で候補が絞り込まれる', async () => {
    const user = setup();
    await user.type(await findInput(), 'らーめん');

    expect(
      await screen.findByRole('option', { name: 'ラーメン' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: '日本料理' })
    ).not.toBeInTheDocument();
  });

  it('候補を選択するとgenreIdが更新される', async () => {
    const user = setup();
    await user.type(await findInput(), '日本');
    await user.click(await screen.findByRole('option', { name: '日本料理' }));

    await waitFor(() =>
      expect(screen.getByTestId('genreId')).toHaveTextContent('g2')
    );
    // jsdomではinputのvalueプロパティ更新が反映されないため、属性で確認する
    expect(await findInput()).toHaveAttribute('value', '日本料理');
  });

  it('該当がない場合はメッセージを表示する', async () => {
    const user = setup();
    await user.type(await findInput(), 'ステーキ');

    expect(
      await screen.findByText('該当するジャンルがありません')
    ).toBeInTheDocument();
  });

  it('既存のgenreIdがある場合は入力欄にジャンル名が表示される', async () => {
    setup({ defaultGenreId: 'g3' });

    await waitFor(async () =>
      expect(await findInput()).toHaveValue('イタリアン')
    );
  });

  it('未選択で送信すると必須エラーが表示される', async () => {
    const user = setup();
    await findInput();
    await user.click(screen.getByRole('button', { name: 'submit' }));

    expect(await screen.findByText('ジャンルは必須です')).toBeInTheDocument();
  });
});
