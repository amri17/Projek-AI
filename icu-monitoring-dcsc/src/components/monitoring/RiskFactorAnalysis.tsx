interface RiskFactor {

  feature: string;

  value: number | string;

  shap_value: number;

  direction: string;

}



interface RiskFactorAnalysisProps {

  data: RiskFactor[];

}




export default function RiskFactorAnalysis({
  data
}: RiskFactorAnalysisProps) {


  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-sm
      p-6
      "
    >

      <h2
        className="
        text-lg
        font-semibold
        text-slate-800
        mb-4
        "
      >
        Risk Factor Analysis
      </h2>



      <p
        className="
        text-sm
        text-slate-500
        mb-5
        "
      >
        Top Factors Increasing Risk
      </p>




      <div className="space-y-4">


        {
          data.map(
            (
              factor: RiskFactor,
              index: number
            ) => (


            <div
              key={index}
              className="
              bg-slate-50
              rounded-xl
              p-4
              border
              "
            >


              <h3
                className="
                font-semibold
                text-slate-800
                capitalize
                "
              >

                🔴 {factor.feature}

              </h3>



              <p
                className="
                text-sm
                text-slate-600
                mt-2
                "
              >

                Value :
                {" "}
                {factor.value}

              </p>




              <p
                className="
                text-sm
                text-red-600
                font-semibold
                "
              >

                Contribution :
                {" +"}
                {factor.shap_value.toFixed(2)}

              </p>



            </div>


          ))
        }


      </div>


    </div>
  );

}