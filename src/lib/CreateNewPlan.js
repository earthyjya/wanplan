import axios from "axios";
export default async function CreateNewPlan(APIServer, user_id, isLoggedIn, RedirectFunc) {
	let newUserId = 0;
	if (isLoggedIn) newUserId = user_id;
	const newPlan = {
		plan_title: "untitled",
		user_id: newUserId,
		city_id: 2,
		duration: 1,
		plan_style: "",
		plan_description: "",
		original_id: 0,
		available: 0,
		star_rating: 0
	};
	const url = APIServer + "/plan_overview";
	await axios
		.post(url, newPlan)
		.then(result => {
			if (result.data === null) alert("Could not create new plan :(");
			else {
				newPlan.plan_id = result.data.id;
				if (!isLoggedIn) {
					if (
						localStorage.getItem("planlist") === null ||
						localStorage.getItem("planlist") === []
					) {
						var _planlist = [];
						_planlist[0] = newPlan;
						localStorage.setItem("planlist", JSON.stringify(_planlist));
					} else {
						let _planlist = JSON.parse(localStorage.getItem("planlist"));
						_planlist.push(newPlan);
						// console.log(_planlist);
						localStorage.setItem("planlist", JSON.stringify(_planlist));
					}
				}
				RedirectFunc(newPlan.plan_id);
				// console.log(result);
			}
		})
		.catch(error => {
			console.log(error);
		});
}
