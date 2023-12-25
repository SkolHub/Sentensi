import "./Create.scss";
import { CreateContextProvider } from "./components/CreateContext";
import CreateLayout from "./components/CreateLayout";

const Page = () => {
  return (
    <CreateContextProvider>
      <CreateLayout />
    </CreateContextProvider>
  );
};

export default Page;
