import Loader from "../component/Loader";

export default function RootPage() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Loader label={"Loading something cool 😍"} size={8} />
    </div>
  );
}
