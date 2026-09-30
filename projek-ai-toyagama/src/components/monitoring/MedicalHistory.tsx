interface History {

  date: string;
  diagnosis: string;
  complaint: string;
  treatment: string;
  doctor: string;

}


export default function MedicalHistory({
  data,
}:{
  data: History[];
}) {


return (

<div className="
`bg-white
rounded-2xl
shadow-sm
p-6
h-full
">


<h2 className="
text-xl
font-bold
text-slate-800
mb-5
">
Medical History
</h2>



<div className="space-y-4">


{
data.map((item,index)=>(


<div
key={index}
className="
bg-slate-50
rounded-xl
p-4
border
"
>


<p className="text-sm text-gray-500">
Date
</p>

<p className="font-semibold">
{item.date}
</p>


<p className="text-sm text-gray-500 mt-3">
Diagnosis
</p>

<p>
{item.diagnosis}
</p>


<p className="text-sm text-gray-500 mt-3">
Complaint
</p>

<p>
{item.complaint}
</p>


<p className="text-sm text-gray-500 mt-3">
Treatment
</p>

<p>
{item.treatment}
</p>


<p className="text-sm text-gray-500 mt-3">
Doctor
</p>

<p>
{item.doctor}
</p>



</div>


))
}



</div>


</div>

)

}