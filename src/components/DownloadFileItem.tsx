import { FC, useEffect, } from 'react';
import { useLazyDownloadFileQuery } from '../redux/api/fileApi';


interface DownloadFileItemProps {
    context: string; // или другие варианты
    contextId: number;
    fileId: number;
    filename: string;
    children?: React.ReactNode; // отображаемое содержимое, например, название файла
}

const DownloadFileItem: FC<DownloadFileItemProps> = ({
  context,
  contextId,
  fileId,
  filename,
  children,
}) => {
  // Используем lazy query, чтобы инициировать запрос по событию
  const [triggerDownload, { data, error, isLoading }] = useLazyDownloadFileQuery();

  // Эффект, который отслеживает появление данных и запускает скачивание
  useEffect(() => {
    if (data) {
      console.log("downloading file")
      // Создаём URL для Blob-объекта
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  }, [data, filename]);

  // Инициируем запрос скачивания файла
  const handleClick = () => {
    triggerDownload({ context, contextId, fileId });
  };

  return(
    <div className='cursor-pointer hover:text-dark_blue duration-50' onClick={handleClick}>
      {children}
    </div>
  )
}

export default DownloadFileItem;