export const ReorderDetail = (plan_detail) =>
  plan_detail.reduce(
    (acc, cur, idx) => [...acc, { ...cur, attraction_order: idx }],
    []
  );

export const ReorderStartday = (plan_startday) =>
  plan_startday.reduce(
    (acc, cur, idx) => [...acc, { ...cur, day: idx + 1 }],
    []
  );

export const ReorderTransport = (transport) =>
  transport.reduce(
    (acc, cur, dayIdx) => [
      ...acc,
      cur.map((tran, order) => {
        return { ...tran, day: dayIdx + 1, trans_order: order };
      }),
    ],
    []
  );
