import React, { useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function TestsupaBase() {

  useEffect(() => {
    async function checkConnection() {
      const { data, error } = await supabase.from("profiles").select("*");
    }

    checkConnection();
  }, []);

  return <></>;
}
