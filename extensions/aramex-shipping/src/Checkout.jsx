// import {
//   useExtensionApi,
//   useBuyerJourneyIntercept,
//   reactExtension,
//   useDeliveryGroupListTarget,
//   ChoiceList,
// } from "@shopify/ui-extensions-react/checkout";

// export default reactExtension('purchase.checkout.block.render', () => {
//   const { attributes, updateAttribute } = useDeliveryGroupListTarget();

//   const handleChange = async (value) => {
//     await updateAttribute('delivery_method', value);
//   };

//   return (
//     <ChoiceList
//       name="delivery-method"
//       title="Choose a Delivery Method"
//       value={attributes.delivery_method || ''}
//       onChange={handleChange}
//     >
//       <ChoiceList.Choice id="shipping">Standard Shipping</ChoiceList.Choice>
//       <ChoiceList.Choice id="pickup">Local Pickup</ChoiceList.Choice>
//       <ChoiceList.Choice id="aramex">Aramex Pickup</ChoiceList.Choice>
//     </ChoiceList>
//   );
// });


import React from "react";

import {
  useExtensionApi,
  reactExtension,
  ChoiceList,
  Choice,
  useDeliveryGroupListTarget,
  useShippingOptionTarget,
  useBuyerJourneyIntercept,
  BlockStack,
  Text,
} from "@shopify/ui-extensions-react/checkout";

const aramexBranches = [
  "Dubai Festival City - Dubai",
  "Ajman Ramada - Ajman",
  "Al Ain - Abu Dhabi",
  "Al Ghurair Centre - Dubai",
  "Deira City Centre - Dubai",
  "Dubai Internet City - Dubai",
  "Ras Alkhaimah - Ras al Khaimah",
  "Sahara Centre - Sharjah",
  "Sharjah - Sharjah",
  "Sharjah Muwailah - Sharjah",
  "Ajman Al Jurf - Ajman",
  "Umm Ramool - Dubai",
  "Nakheel Mall Outlet - Dubai",
  "JVC Circle Mall - Dubai",
  "Dubai Commercity - Umm Ramool - Dubai",
  "IBN Battuta Mall - Dubai",
  "Old Airport Rd. - Abu Dhabi",
  "Mussafah - Abu Dhabi",
  "Shahama - Abu Dhabi",
];

export default reactExtension(
  "purchase.checkout.shipping-option-item.details.render",
  () => <AramexPickupSelector />,
);

function AramexPickupSelector() {
  const { selectedDeliveryOption } = useDeliveryGroupListTarget();
  const { shippingOptionTarget, isTargetSelected } = useShippingOptionTarget();
  const { applyAttributeChange } = useExtensionApi();
  const [selectedBranch, setSelectedBranch] = React.useState(null);
  console.log(
    shippingOptionTarget,
    selectedDeliveryOption,
    selectedBranch,
    "shippingOptionTarget",
  );
  // Detect if this is Aramex pickup option
  const isAramexPickup =
    shippingOptionTarget?.title?.toLowerCase().includes("aramex") ||
    shippingOptionTarget?.handle?.includes("aramex");
  console.log(isAramexPickup, isAramexPickup, "isAramexPickup");

  // Block checkout if branch not selected
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (!selectedBranch) {
      return {
        behavior: "block",
        reason: "Aramex branch selection required",
        errors: [{ message: "Please select a pickup branch" }],
      };
    }
    return { behavior: "allow" };
  });

  const handleChange = (selected) => {
    console.log(selected, "branch");
    setSelectedBranch(selected);
    applyAttributeChange({
      type: "updateAttribute",
      key: "aramex_pickup_location",
      value: selected,
    });
  };

  if (!isAramexPickup || !isTargetSelected) {
    return null;
  }

  return (
    <BlockStack spacing="base">
      <Text size="base" emphasis="bold">
        Select Aramex Pickup Branch:
      </Text>
      <ChoiceList
        name="aramex-pickup-location"
        value={selectedBranch}
        onChange={handleChange}
        allowMultiple={false}
      >
        {aramexBranches.map((branch) => (
          <Choice key={branch} id={branch}>
            {branch}
          </Choice>
        ))}
      </ChoiceList>
    </BlockStack>
  );
}

