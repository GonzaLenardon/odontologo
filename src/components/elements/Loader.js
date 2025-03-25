import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loader({ open, text }) {
  return (
    <div>
      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        })}
        open={open}
      >
        <CircularProgress color="inherit" />
        {text && <div className="flex m-auto my-0">{text}</div>}
      </Backdrop>
    </div>
  );
}
