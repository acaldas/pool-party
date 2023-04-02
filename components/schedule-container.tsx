import { BigNumberish } from "ethers";
import { loadSchedule } from "../app/config";
import Schedule from "./schedule";

export default async function ScheduleContainer({
  pools,
  currentDay,
}: {
  pools: Pool[];
  currentDay: BigNumberish;
}) {
  const schedules = await loadSchedule(pools, currentDay);

  return <Schedule schedules={schedules} pools={pools} />;
}
