import BackdropContainer from "./backdrop-container";
import ConnectButton from "./connect-button";
import Timer from "./timer";

const date = new Date();
date.setHours(0, 0, 0, 0);
date.setDate(date.getDate() + 1);

export default function Header() {
  return (
    <BackdropContainer
      blur={9.5}
      className="grid h-[80px] grid-cols-3 items-center bg-[rgba(18,175,224,0.75)] px-[2.4vw]"
    >
      <h1>Pool Party</h1>
      <h1 className="justify-self-center text-pink">
        PARTYTIMER:{" "}
        <Timer className="pl-1" timeRemaining={date.toUTCString()} />
      </h1>
      <div className="justify-self-end">
        <ConnectButton />
      </div>
    </BackdropContainer>
  );
}
