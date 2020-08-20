export const AddNewPlanToPlanDetail = (plan_detail, index, toAdd) => {
    console.log(plan_detail)
    plan_detail = plan_detail.map((plan) => {
      if (plan.attraction_order >= index)
        return { ...plan, attraction_order: plan.attraction_order + 1 };
      else return plan;
    });
    plan_detail.splice(index, 0, toAdd);
    return plan_detail;
  };