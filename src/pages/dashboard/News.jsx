import React from "react";

function News() {
  return (
    <div className="max-w-2xl mx-auto  pt-[50px] rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-light mb-4">
        Instructions on How to Use fafullz Matched Fullz
      </h2>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-light">
          Step 1: Login to FSAID
        </h3>
        <ul className="list-disc list-inside ml-4 text-light">
          <li>
            Go to the <span className="font-medium">FSAID</span> website.
          </li>
          <li>
            Enter the <span className="font-medium">"Username/Email"</span> on the login screen.
          </li>
          <li>
            Enter <span className="font-medium">"FA Pass"</span> as the password.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-light">
          Option 1 (Recommended): Login Using 2FA
        </h3>
        <ul className="list-disc list-inside ml-4 text-light">
          <li>
            Click on{" "}
            <span className="font-medium">"Enter Code"</span>{" "}
           - Authenticator App option.
          </li>
          <li>
            Click <a href="https://fafullz.org/2fa" className="text-blue-500">here</a> to generate the 2FA code.
          </li>
          <li>
            Paste 2FA secret and copy the code.
          </li>
          <li>Proceed to access the account.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-light">
          Option 2: Login Using Email Verification Code
        </h3>
        <ul className="list-disc list-inside ml-4 text-light">
          <li>
            Go to <span className="font-medium">mail.tm</span> website.
          </li>
          <li>
            Click on <span className="font-medium">Profile</span> in the top
            right corner and log in.
          </li>
          <li>
            Enter the <span className="font-medium">Email</span> and{" "}
            <span className="font-medium">Email Pass</span> to log in.
          </li>
          <li>Retrieve the verification code and proceed.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-light">
          Option 3: Login Using Backup Code
        </h3>
        <ul className="list-disc list-inside ml-4 text-light">
          <li>
            Click on{" "}
            <span className="font-medium">"Help me access my account"</span>{" "}
            instead of "Send Code".
          </li>
          <li>
            Select{" "}
            <span className="font-medium">
              "Backup Code & Challenge Questions"
            </span>{" "}
            and click <span className="font-medium">"Enter Code"</span>.
          </li>
          <li>
            Enter the Backup Code from the fullz and click{" "}
            <span className="font-medium">"Continue"</span>.
          </li>
          <li>Answer the Security Questions from the fullz.</li>
          <li>Proceed to access the account.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-light">Final Steps</h3>
        <p className="text-light">Once logged in, remember to:</p>
        <ul className="list-disc list-inside ml-4 text-light">
          <li>Change the email to your own.</li>
          <li>Update the address and username.</li>
        </ul>
      </section>
    </div>
  );
}

export default News;
