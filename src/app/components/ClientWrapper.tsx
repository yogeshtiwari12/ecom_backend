"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../redux/store";
import NextAuthProvider from "../providers/SessionProvider";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </PersistGate>
    </Provider>
  );
}
