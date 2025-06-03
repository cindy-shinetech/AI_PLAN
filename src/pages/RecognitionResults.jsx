
import { useLocation } from 'react-router-dom'
import { PageContainer } from "../components/Layout/PageContainer"
import { useEffect, useState } from 'react'

export default function RecognitionResults() {
  const location = useLocation()
  const uploadedFileUrl = location.state?.uploadedFileUrl
  const fileType = location.state?.fileType
  const isPdf = fileType === 'application/pdf'

  const [dataItems, setDataItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    // 读取线段识别结果
    fetch('/lines_output.json')
      .then(res => res.json())
      .then(lines => {
        const enriched = lines.map((line, index) => ({
          id: index + 1,
          name: `Line ${index + 1}`,
          properties: [
            { name: 'Start', value: `(${line.start[0]}, ${line.start[1]})` },
            { name: 'End', value: `(${line.end[0]}, ${line.end[1]})` },
            { name: 'Length', value: `${line.length} pt` }
          ]
        }))
        //   const enriched = lines.map((line, index) => {
        //   const start = line.start
        //   const end = line.end
        //   const dx = end[0] - start[0]
        //   const dy = end[1] - start[1]
        //   const length = Math.sqrt(dx * dx + dy * dy).toFixed(2)

        //   return {
        //     id: index + 1,
        //     name: `Line ${index + 1}`,
        //     properties: [
        //       { name: 'Start', value: `(${start[0]}, ${start[1]})` },
        //       { name: 'End', value: `(${end[0]}, ${end[1]})` },
        //       { name: 'Length', value: `${length} pt` }
        //     ]
        //   }
        // })

        setDataItems(enriched)
        setSelectedItem(enriched[0])
      })
      .catch(err => {
        console.error("加载线段失败", err)
      })
  }, [])

  return (
    <PageContainer>
      <div className="flex flex-row gap-6">
        {/* 左侧：导航 + 数据表格 */}
        <div className="w-[500px] flex flex-row gap-2">
          {/* 导航列表 */}
          <div className="w-[220px] bg-white rounded-lg shadow-md p-4">
            <h4 className="text-md font-semibold mb-4">Lines</h4>
            <div className="space-y-2">
              {dataItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left p-2 rounded-md transition-colors ${
                    selectedItem?.id === item.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* 数据表格 */}
          <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
            <h4 className="text-md font-semibold mb-3">{selectedItem?.name || 'Line'} Properties</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedItem?.properties.map((prop, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{prop.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{prop.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 右侧：文件展示 */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-4">
          <h4 className="text-md font-semibold mb-3">Building Plan</h4>
          {uploadedFileUrl ? (
            <div className="flex justify-center border border-gray-200 rounded-md p-4 bg-gray-50">
              {isPdf ? (
                <iframe
                  src={uploadedFileUrl}
                  title="Uploaded PDF"
                  className="w-full h-[600px]"
                />
              ) : (
                <img
                  src={uploadedFileUrl}
                  alt="Uploaded building plan"
                  className="max-h-[600px] object-contain"
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
              <p className="text-gray-500">No file available</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}




// import { useLocation } from 'react-router-dom'
// import { PageContainer } from "../components/Layout/PageContainer";
 


// export default function RecognitionResults() {
//   const location = useLocation();
//   const uploadedFileUrl = location.state?.uploadedFileUrl;
//   const fileType = location.state?.fileType;
//   const isPdf = fileType === 'application/pdf';


//   const dataItems = [
//     { id: 1, name: 'Line 1', properties: [{ name: 'Meta', value: 'Data' }] },
//     { id: 2, name: 'Line 2', properties: [{ name: 'Length', value: '60.00' }, { name: 'Width', value: '30.00' }] },
//     { id: 3, name: 'Line 3', properties: [{ name: 'Unit', value: 'mm' }] },
//     { id: 4, name: 'Rooms', properties: [{ name: 'Room A', value: '25.00 sqm' }, { name: 'Room B', value: '18.50 sqm' }, { name: 'Room C', value: '12.75 sqm' }] }
//   ];
//   const [selectedItem, setSelectedItem] = useState(dataItems[0]);

 


// return (
//   <PageContainer>
//     <div className="flex flex-row gap-6">
//       {/* 左侧：导航 + 数据表格 */}
//       <div className="w-[500px] flex flex-row gap-2">
//         {/* 导航列表 */}
//         <div className="w-[220px] bg-white rounded-lg shadow-md p-4">
//           <h4 className="text-md font-semibold mb-4">Lines</h4>
//           <div className="space-y-2">
//             {dataItems.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => setSelectedItem(item)}
//                 className={`w-full text-left p-2 rounded-md transition-colors ${
//                   selectedItem.id === item.id
//                     ? 'bg-blue-100 text-blue-700 font-medium'
//                     : 'hover:bg-gray-100 text-gray-700'
//                 }`}
//               >
//                 {item.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* 数据表格 */}
//         <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
//           <h4 className="text-md font-semibold mb-3">{selectedItem.name} Properties</h4>
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {selectedItem.properties.map((prop, idx) => (
//                 <tr key={idx}>
//                   <td className="px-6 py-4 text-sm font-medium text-gray-900">{prop.name}</td>
//                   <td className="px-6 py-4 text-sm text-gray-600">{prop.value}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* 右侧：文件展示 */}
//       <div className="flex-1 bg-white rounded-lg shadow-md p-4">
//         <h4 className="text-md font-semibold mb-3">Building Plan</h4>
//         {uploadedFileUrl ? (
//           <div className="flex justify-center border border-gray-200 rounded-md p-4 bg-gray-50">
//             {isPdf ? (
//               <iframe
//                 src={uploadedFileUrl}
//                 title="Uploaded PDF"
//                 className="w-full h-[600px]"
//               />
//             ) : (
//               <img 
//                 src={uploadedFileUrl} 
//                 alt="Uploaded building plan" 
//                 className="max-h-[600px] object-contain"
//               />
//             )}
//           </div>
//         ) : (
//           <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
//             <p className="text-gray-500">No file available</p>
//           </div>
//         )}
//       </div>
//     </div>
//   </PageContainer>
// );
// }
