interface AIExplanationProps {

  data:{
    summary:string;
    generated_at:string;
  }

}


export default function AIExplanation({
  data
}:AIExplanationProps){


  return (

    <div className="
      bg-white
      rounded-2xl
      shadow-sm
      p-6
    ">


      <h2 className="
        text-lg
        font-semibold
        text-slate-800
        mb-4
      ">
        AI Clinical Explanation
      </h2>



      <p className="
        text-slate-700
        leading-relaxed
      ">
        {data.summary}
      </p>



      <p className="
        text-sm
        text-slate-500
        mt-5
      ">
        Generated:
        {" "}
        {
          new Date(
            data.generated_at
          ).toLocaleString()
        }
      </p>


    </div>

  );

}