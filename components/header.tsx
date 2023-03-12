import ConnectButton from "./connect-button";

export default function Header() {
  return (
    <div className="h-[80px] bg-[rgba(18,175,224,0.75)] backdrop-blur-[9.5px] grid grid-cols-3 items-center px-[2.4vw]">
      <h1>Pool Party</h1>
      <h1 className="text-pink justify-self-center">
        PARTYTIMER: <span className="pl-1">2:23:22</span>
      </h1>
      <div className="justify-self-end">
        <ConnectButton />
      </div>
    </div>
  );
}
