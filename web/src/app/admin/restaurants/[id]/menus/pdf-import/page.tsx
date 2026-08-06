import { PdfImport } from '@/features/Admin/Menus/PdfImport';

const PdfImportPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <PdfImport restaurantId={id} />;
};

export default PdfImportPage;
