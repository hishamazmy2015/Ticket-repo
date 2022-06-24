import React from "react";
import { useState, useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/user-request";
import axios from "axios";
// import Router from 'next/router'

export default () => {
  debugger;
  const { doRequest, errors } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };
  useEffect(() => {
    doRequest();
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign out</h1>

      {errors}
    </form>
  );
};
