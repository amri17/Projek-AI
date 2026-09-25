interface LabResultTableProps {
  data: {
    parameter: string;
    value: number;
    unit: string;
    reference: string;
    status: string;
  }[];
}


export default function LabResultTable({
  data
}: LabResultTableProps) {


  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">


      <h2 className="text-lg font-semibold text-slate-800 mb-5">
        Laboratory Result
      </h2>



      <div className="overflow-x-auto">

        <table className="w-full">


          <thead>

            <tr className="
              border-b 
              text-left 
              text-slate-500
            ">

              <th className="py-3">
                Parameter
              </th>


              <th>
                Result
              </th>


              <th>
                Reference
              </th>


              <th>
                Status
              </th>


            </tr>

          </thead>



          <tbody>


            {data.map((lab) => (

              <tr
                key={lab.parameter}
                className="border-b"
              >


                <td className="py-3 font-medium text-slate-800">
                  {lab.parameter}
                </td>



                <td className="text-slate-700">

                  {lab.value} {lab.unit}

                </td>



                <td className="text-slate-500">

                  {lab.reference}

                </td>



                <td>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-medium

                      ${
                        lab.status === "High"
                        ? 
                        "bg-red-100 text-red-600"

                        :
                        lab.status === "Low"
                        ?
                        "bg-yellow-100 text-yellow-600"

                        :
                        "bg-green-100 text-green-600"
                      }
                    `}
                  >

                    {lab.status}

                  </span>

                </td>


              </tr>

            ))}


          </tbody>


        </table>


      </div>


    </div>
  );
}