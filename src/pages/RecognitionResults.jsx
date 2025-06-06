import { useLocation } from 'react-router'
import { PageContainer } from "../components/Layout/PageContainer"
import { useEffect, useState } from 'react'
import PlanCanvas from './PlanCanvas'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function RecognitionResults() {
  const location = useLocation()
  const uploadedFileUrl = location.state?.uploadedFileUrl
  const resultJson = location.state?.resultJson
  const recognitionType = location.state?.recognitionType === 'ai'
  console.log("RecognitionResults", uploadedFileUrl, resultJson)

  const [dataItems, setDataItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(dataItems.length / itemsPerPage)
  const paginatedItems = dataItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    if (!resultJson || !Array.isArray(resultJson.lines)) {
      console.error("error resultJson")
      return
    }
    let lineSet;
    if(recognitionType){ 
      lineSet = resultJson.lines
      .sort((l1, l2) => {
        if (l1.start[0] === l2.start[0]) {
          return l1.start[1] - l2.start[1]
        } else {
          return l1.start[0] - l2.start[0]
        }
      }) 
  }
    else{
      lineSet = resultJson.lines.filter(l => l.length > 20
      && 0 < l.start[0] && l.start[0] < resultJson.ptWidth
      && 0 < l.start[1] && l.start[1] < resultJson.ptHeight
      && 0 < l.end[0] && l.end[0] < resultJson.ptWidth
      && 0 < l.end[1] && l.end[1] < resultJson.ptHeight)
      .sort((l1, l2) => {
        if (l1.start[0] === l2.start[0]) {
          return l1.start[1] - l2.start[1]
        } else {
          return l1.start[0] - l2.start[0]
        }
      })
    }
    const enriched = lineSet.map((line, index) => ({
      id: index + 1,
      name: `${location.state?.recognitionType === 'ai' ? line.class : 'Line'} ${index + 1}`,
      properties: [
        { name: 'Start', value: `(${line.start[0]}, ${line.start[1]})` },
        { name: 'End', value: `(${line.end[0]}, ${line.end[1]})` },
        { name: 'Length', value: `${line.length}${recognitionType ? 'px' : 'pt'}` }
      ]
    }))
    setDataItems(enriched)
    setSelectedItem(enriched[0])
    setCurrentPage(1)
  }, [location.state])

  return (
    <PageContainer>
      <div className="flex flex-row gap-2">
        {/* 左侧：导航 + 数据表格 */}
        <div className="w-[500px] flex flex-row gap-2">
          {/* 导航列表 */}
          <div className="w-[220px] bg-white rounded-lg shadow-md p-4">
            <h4 className="text-md font-semibold mb-4">Lines</h4>
            <div className="space-y-2">
              {paginatedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item)
                  }}
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

            {/* 分页图标按钮 */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-gray-100 rounded disabled:opacity-50"
              >
                <FiChevronLeft size={18} className="text-gray-600" />
              </button>

              <span className="text-sm text-gray-600">
                 {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-100 rounded disabled:opacity-50"
              >
                <FiChevronRight size={18} className="text-gray-600" />
              </button>
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
          {recognitionType ? 'AI Result For Building Plan' : 'PDF Result For Building Plan'}
          {uploadedFileUrl ? (
            <div className="flex justify-center border border-gray-200 rounded-md p-4 bg-gray-50">
              <PlanCanvas
                ptWidth={resultJson.ptWidth}
                ptHeight={resultJson.ptHeight}
                pxWidth={resultJson.pxWidth}
                pxHeight={resultJson.pxHeight}
                dpi={resultJson.dpi}
                imageSource={resultJson.image}
                elements={
                (location.state?.recognitionType === 'ai'
                    ? resultJson.convertedElements.sort((l1, l2) => {
                    if (l1.x1 === l2.x1) {
                      return l1.y1 - l2.y1;
                    } else {
                      return l1.x1 - l2.x1;
                    }
                  })   
                    : resultJson.convertedElements.filter(l =>
                        l.length > 20 &&
                        0 < l.x1 && l.x1 < resultJson.ptWidth &&
                        0 < l.y1 && l.y1 < resultJson.ptHeight &&
                        0 < l.x2 && l.x2 < resultJson.ptWidth &&
                        0 < l.y2 && l.y2 < resultJson.ptHeight
                      )
                  ).sort((l1, l2) => {
                    if (l1.x1 === l2.x1) {
                      return l1.y1 - l2.y1;
                    } else {
                      return l1.x1 - l2.x1;
                    }
                  })
                }
                selectedIndex={selectedItem?.id - 1}
                style={{ width: '100%', height: '100%' }}
                isAiResult={location.state?.recognitionType === 'ai'}
              />
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
