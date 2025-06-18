import {
  reactExtension,
  TextField,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  Text,
  BlockStack,
  useExtensionApi,
} from "@shopify/ui-extensions-react/checkout";
import React, { useState } from "react";

export default reactExtension("purchase.checkout.block.render", () => (
  <NationalIdBlock />
));

function NationalIdBlock() {
  const { applyAttributeChange } = useExtensionApi();
  const [nationalId, setNationalId] = useState("");
  const [validationError, setValidationError] = useState("");
  const canBlockProgress = useExtensionCapability("block_progress");
  
  const label = canBlockProgress ? "National ID Number" : "National ID Number (optional)";

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (canBlockProgress && !isNationalIdSet()) {
      return {
        behavior: "block",
        reason: "National ID is required",
        perform: (result) => {
          if (result.behavior === "block") {
            setValidationError("Please enter your National ID number");
          }
        },
      };
    }

    return {
      behavior: "allow",
      perform: () => {
        clearValidationErrors();
      },
    };
  });

  function isNationalIdSet() {
    return nationalId.trim() !== "";
  }

  function clearValidationErrors() {
    setValidationError("");
  }

  const handleChange = (value) => {
    setNationalId(value);
    applyAttributeChange({ type: "updateAttribute", key: "national_id", value });
    clearValidationErrors();
  };

  return (
    <BlockStack spacing="base">
      <Text size="base" emphasis="bold">
        {label} {canBlockProgress && "*"}
      </Text>
      <TextField
        value={nationalId}
        onChange={handleChange}
        label="Enter your National ID number"
        required={canBlockProgress}
        error={validationError}
        onInput={clearValidationErrors}
      />
    </BlockStack>
  );
}