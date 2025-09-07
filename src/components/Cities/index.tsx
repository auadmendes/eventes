// "use client";

// import { createCityAction, getCitiesAction } from "@/actions/city.server";
// import { useState } from "react";

// export default function CityForm() {
//   const [cityName, setCityName] = useState("");
//   const [cities, setCities] = useState<any[]>([]);

//   const handleAddCity = async () => {
//     "use server"; // 💡 This marks it as a server action
//     await createCityAction(cityName);
//     const allCities = await getCitiesAction();
//     setCities(allCities);
//     setCityName("");
//   };

//   return (
//     <div>
//       <input value={cityName} onChange={e => setCityName(e.target.value)} />
//       <button onClick={handleAddCity}>Add City</button>

//       <ul>
//         {cities.map(c => <li key={c.id}>{c.name}</li>)}
//       </ul>
//     </div>
//   );
// }
