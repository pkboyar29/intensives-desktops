// import Title from '../components/common/Title';
// import PrimaryButton from '../components/common/PrimaryButton';
// import { FC, useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import AttachTestModal from '../components/common/modals/AttachTestModal';
// import {
//   useAttachTestMutation,
//   useLazyGetIntensiveTestQuery,
// } from '../redux/api/testIntensiveApi';

// const IntensiveTests = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const { intensiveId } = useParams();
//   const [attachTest] = useAttachTestMutation();
//   const [getTests, { data: tests, isLoading }] = useLazyGetIntensiveTestQuery();

//   useEffect(() => {
//     getTests(intensiveId);
//   }, [intensiveId, getTests]);

//   const handleAttach = async (data: {
//     testId: number;
//     startDate: string;
//     endDate: string;
//     attempts: number;
//   }) => {
//     if (!intensiveId) return;
//     try {
//       await attachTest({
//         intensiveId,
//         testId: data.testId,
//         startDate: data.startDate,
//         endDate: data.endDate,
//         attempts: data.attempts,
//       }).unwrap();
//       getTests(intensiveId); // Принудительно обновляем список тестов после успешного добавления
//     } catch (e) {
//       // Можно добавить обработку ошибок
//     }
//   };

//   return (
//     <div>
//       <Title text="Тесты" />
//       <div className="flex justify-end">
//         <div>
//           <PrimaryButton clickHandler={() => setModalOpen(true)}>
//             Прикрепить тест
//           </PrimaryButton>
//         </div>
//       </div>
//       <AttachTestModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onAttach={handleAttach}
//       />
//       <div className="mt-6">
//         {isLoading && <div>Загрузка...</div>}
//         {tests && tests.results && tests.results.length === 0 && (
//           <div>Нет прикрепленных тестов</div>
//         )}
//         {tests && tests.results && tests.results.length > 0 && (
//           <ul>
//             {tests.results.map((test: any) => (
//               <li key={test.id} className="p-2 mb-2 border rounded">
//                 <div className="font-semibold">
//                   {test.test?.name || test.name}
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   {test.test?.description || test.description}
//                 </div>
//                 {test.start_date && (
//                   <div className="text-xs text-gray-400">
//                     Доступен с: {new Date(test.start_date).toLocaleString()}
//                   </div>
//                 )}
//                 {test.end_date && (
//                   <div className="text-xs text-gray-400">
//                     Доступен до: {new Date(test.end_date).toLocaleString()}
//                   </div>
//                 )}
//                 {test.attempts_allowed && (
//                   <div className="text-xs text-gray-400">
//                     Попыток: {test.attempts_allowed}
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default IntensiveTests;
