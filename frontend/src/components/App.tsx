import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import Home from "../pages/Home";
import { LoadingOverlay, Modal } from "@mantine/core";
import { useUI } from "../contexts/UIContext";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import { useAuth } from "../contexts/AuthContext";
import Restaurants from "../pages/Restaurants";

function App() {
  const { showModal, setShowModal } = useUI();
  const { initialLoading } = useAuth();

  const showModalMap = {
    signin: <SignInModal />,
    signup: <SignUpModal />,
    null: null,
  };

  return (
    <div>
      <Modal
        style={{ position: "relative", zIndex: 1000 }}
        lockScroll={false}
        padding={0}
        opened={showModal !== "null"}
        onClose={() => setShowModal("null")}
        centered
        withCloseButton={false}
        closeOnClickOutside={false}
      >
        {showModalMap[showModal]}
      </Modal>

      <LoadingOverlay visible={initialLoading} overlayBlur={5} pos={"fixed"} />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="*" element={"Not found"} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
