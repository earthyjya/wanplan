export const UpdatePlanInCache = (plan_id, plan_overview) => {
  let _planlist = JSON.parse(localStorage.getItem("planlist"));
  if (_planlist !== [] && _planlist !== null) {
    localStorage.setItem(
      "planlist",
      JSON.stringify(
        _planlist.map((plan) => {
          if (plan.plan_id === plan_id) return plan_overview;
          return plan;
        })
      )
    );
  }
};

export const SaveNewPlanToCache = (savedplan) => {
  let _planlist = JSON.parse(localStorage.getItem("planlist"));
  if (!_planlist || _planlist === []) {
    _planlist = [savedplan];
  } else {
    _planlist.push(savedplan);
  }
  localStorage.setItem("planlist", JSON.stringify(_planlist));
};
