import React from "react";
import FAQ from "./FAQ";

function FAQpage() {
  return (
    <div className="bg-light min-h-screen">
      <div className="text-gray-600 pt-10 text-center">
        <p>
          <span className="text-3xl">Faq </span> frequently asked questions
        </p>
      </div>
      <div className="min-w-full pt-14 px-2">
        <FAQ
          question="Rules"
          answer={[
            "1. All your balance, replenished by any method, is a part of the Fafullz website and is non-refundable (non-returnable) outside Fafullz.",

            <br />,
            <br />,

            "2. We are not responsible for your links passability (negotiability).",
            <br />,
            <br />,

            "3. Save all purchases to your device, we wipe sold tems data from time to time.",
            <br />,
            <br />,

            "4. In case if insults or threats, your account will be blocked without refunds.",
            <br />,
            <br />,

            "5. There is no moneyback out of Fafullz.",
          ]}
        />

        <FAQ
          question="Seller Rules"
          answer={[
            <p className=" text-2xl md:text-4xl pb-4  ">
              We think that it will be fair for you to open seller-2-buyer
              disclosure terms via Fafullz.
            </p>,
            <hr />,
            <br />,
            <br />,
            <p className="text-3xl">Rules for seller:</p>,
            <div className="pl-6 pt-2">
              1. All your balance, replenished by any method, is a part of the
              Fafullz website and is non-refundable (non-returnable) outside
              Fafullz.
              <br />
              <br />
              2. We are not responsible for your links passability
              (negotiability).
              <br />
              <br />
              3. Save all purchases to your device, we wipe sold tems data from
              time to time.
              <br />
              <br />
              4. In case if insults or threats, your account will be blocked
              without refunds.
              <br />
              <br />
              5. There is no moneyback out of Fafullz.
            </div>,
          ]}
        />
        <FAQ
          question="Purchase rules for SSN/DOB"
          answer={[
            <div>
              <p className="text-3xl">
                We are not responsible for your links passability
                (negotiability) and successfull/unsuccessfull rate.
              </p>

              <p className="text-xl pt-3">
                Refund for SSN is performed only if you have reason like:
              </p>

              <div className="pl-4 pt-2">1. Holder died <br/> 2. PO Box <br/> 3. Incorrect main Fullz</div>
            </div>,
          ]}
        />
         <FAQ
          question="Purchase rules for Google Voice, TextNow/Mail"
          answer={[
            <div>
              <div className="pl-4 pt-2">1. After the purchase you must change password to your own and setup recovery e-mail to your own. Do it at the first login! <br/> 2. We provide limited warranty — 24 hours since purchase!</div>
            </div>,
          ]}
        />
         <FAQ
          question="Purchase rules for buying accounts (Account markrt):"
          answer={[
            <div>
              <div className="pl-4 pt-2">1. We provide limited warranty — 24 hours since purchase! <br/><br/> 2. Please use clean USA IP-address. Verify how clean it is by clicking "Check IP" tab. <br/><br/> 3. If you faced with some issues and want to claim a refund, you need to: <p className="pl-6">
                1.provide a proof that you've used cookies (for example, upload screenshot to imgur.com) <br/> 2. provide IP-address that you used for login-purposes
                </p> <br /> 4. You need to change the email password and account password immediately after the purchase. </div>
            </div>,
          ]}
        />

      </div>
    </div>
  );
}

export default FAQpage;
