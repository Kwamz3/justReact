# Paystack Mobile Money Integration

I've successfully integrated Paystack's robust payment system into your point-of-sale checkout page. This will allow cashiers to easily process Mobile Money transactions by sending a payment prompt directly to a customer's real phone number.

## Changes Made

1. **Installed Dependencies**: Added `react-paystack` to the project to manage the secure payment flow seamlessly within the React app.
2. **Updated [CheckoutPage.tsx](file:///c:/Subdrive/codebase/react/school/sop_app/pos_login/src/app/pages/CheckoutPage.tsx)**:
   - Integrated the `usePaystackPayment` hook to securely initialize transactions.
   - Added a new state variable, `phoneNumber`, to capture the customer's Mobile Money number.
   - Enhanced the Payment Modal UI: When "Mobile Money" is selected as the payment method, a new input field appears prompting the cashier to enter the customer's phone number.
   - Modified the "Confirm Payment" button to disable if the Mobile Money number is incomplete (less than 9 digits).
   - Configured the Paystack payment initialization to map the cart total, a default customer email, the test public key, and the provided phone number. `react-paystack` will take over from there, bringing up the standard Paystack dialog to send the OTP/USSD prompt to the real number entered.

## Verification

- Try adding an item to the cart and click "Pay". 
- Select **Mobile Money**. You will notice a new field to enter the customer's phone number.
- Enter a valid number and click **Confirm Payment**. The elegant Paystack frame will render, triggering the Mobile Money checkout flow for that real number.

> [!NOTE]
> I used a generic Paystack test API key (`pk_test_c0ba3b954...`). For production, you will need to swap this out with your live public key from your Paystack Dashboard.
