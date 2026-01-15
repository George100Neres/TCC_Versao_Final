'use client'
export default function List(params: {
  columns: any[]
  items: any[]
  buttons?: any[]
}) {

  return (
    <div className="p-6">
        <div className="overflow-x-auto bg-white rounded-lg ">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              { params.items.length === 0 ? (
                <tr>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Nenhum dado disponível</th>
                </tr>
              ) : (
                <tr>
                  {params.columns.map((col, colIndex) => (
                    <th key={colIndex} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                      {col.label}
                    </th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {params.items.map((item: any, rowIndex: number) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {params.columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-3 text-sm text-center text-gray-600">
                      {item[col.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  )
}
