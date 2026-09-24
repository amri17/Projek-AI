interface MonitoringSummaryProps {
  data: {
    condition: string;
    observation: string[];
    recommendation: string[];
  };
}


export default function MonitoringSummary({
  data
}: MonitoringSummaryProps) {


  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">


      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Monitoring Summary
      </h2>



      {/* CONDITION */}

      <div className="mb-5">

        <p className="text-sm text-slate-500 mb-1">
          Current Condition
        </p>


        <p className="text-slate-700 font-medium">
          {data.condition}
        </p>

      </div>




      {/* OBSERVATION */}

      <div className="mb-5">

        <p className="text-sm text-slate-500 mb-2">
          Clinical Observation
        </p>


        <ul className="
          list-disc
          list-inside
          space-y-2
          text-slate-700
        ">

          {
            data.observation.map((item, index)=>(
              
              <li key={index}>
                {item}
              </li>

            ))
          }

        </ul>

      </div>





      {/* RECOMMENDATION */}

      <div>

        <p className="text-sm text-slate-500 mb-2">
          Recommendation
        </p>


        <ul className="
          list-disc
          list-inside
          space-y-2
          text-slate-700
        ">


          {
            data.recommendation.map((item,index)=>(

              <li key={index}>
                {item}
              </li>

            ))
          }


        </ul>


      </div>


    </div>
  );
}