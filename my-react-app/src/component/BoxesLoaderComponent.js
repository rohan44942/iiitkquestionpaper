import { HashLoader } from "react-spinners";
function BoxesLoaderComponent() {
  return (
    <div>
      <HashLoader
        color="#75c2e1"
        cssOverride={{}}
        loading
        size={85}
        speedMultiplier={1}
      />
    </div>
  );
}

export default BoxesLoaderComponent;
