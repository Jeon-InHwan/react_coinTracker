import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

function App() {
  const [value, setValue] = useState("");

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setValue(value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Hello! ${value}`);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="UserName"
        ></input>
        <button>Login</button>
      </form>
    </div>
  );
}

export default App;
