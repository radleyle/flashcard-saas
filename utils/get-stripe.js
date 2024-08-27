// import {loadStripe} from '@stripe/stripe-js'
// let stripePromise
// const getStripe = () => {
//     if (!stripePromise) {
//         stripePromise = loadStripe(process.env.NEXT_STRIPE_PUBLIC_KEY)
//     }
//     return stripePromise
// }

// export default getStripe
import { loadStripe } from '@stripe/stripe-js';

// Ensure the environment variable name matches what you have in .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const getStripe = () => {
    return stripePromise;
};

export default getStripe;
