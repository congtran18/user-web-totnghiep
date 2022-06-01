import { Step, StepLabel, Stepper } from "@mui/material";
import React from "react";

const CheckoutWizard = ({ activeStep = 0 }) => {
  return (
    <Stepper
      sx={{ backgroundColor: "transparent" }}
      activeStep={activeStep}
      alternativeLabel
    >
      {["Đăng nhập", "Thông tin", "Câu hỏi", "Chờ phê duyệt"].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
}

export default CheckoutWizard;