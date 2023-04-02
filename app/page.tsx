import Home from "@components/home";
import Winners from "@components/winners";
import ScheduleContainer from "@components/schedule-container";
import { loadPools } from "./config";

export default async function Page() {
  const { pools, currentDay } = await loadPools();
  return (
    <Home pools={pools}>
      <div className="mb-[4.3vh] xs:mb-10">
        {/* @ts-expect-error Server Component */}
        <Winners pools={pools} />
      </div>
      {/* @ts-expect-error Server Component */}
      <ScheduleContainer pools={pools} currentDay={currentDay} />
    </Home>
  );
}
