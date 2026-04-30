import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LAST_UPDATED = '30 April 2026';

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="font-black text-lg text-indigo-900 mb-3">{title}</h2>
      <div className="space-y-3 text-indigo-800 text-sm font-medium leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm shadow-indigo-100 px-5 pt-safe pt-4 pb-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-indigo-400 active:scale-90 transition-transform flex-shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-indigo-900 text-lg leading-tight">Terms &amp; Conditions</h1>
            <p className="text-xs text-indigo-400 font-semibold">Last updated {LAST_UPDATED}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8">

        {/* Intro */}
        <div className="bg-white rounded-3xl p-5 mb-8 border border-indigo-100">
          <p className="text-indigo-900 text-sm font-medium leading-relaxed">
            These Terms &amp; Conditions govern your use of Portrait Pals. By creating an account
            or using the app, you agree to these terms. Please read them carefully — they are
            written in plain language wherever possible.
          </p>
          <p className="text-indigo-400 text-xs font-semibold mt-3">
            ⚠️ Portrait Pals is currently a prototype. These terms are a draft and must be
            reviewed by a qualified legal professional before the app is offered to the public.
          </p>
        </div>

        <Section title="1. About Portrait Pals">
          <p>
            Portrait Pals is a private application designed for use by early childhood education
            services and the families of enrolled children. Its purpose is to document and
            celebrate children's friendships through photos and notes shared between educators
            and parents.
          </p>
          <p>
            Access to the app is by invitation only. It is not a public platform. Accounts are
            created and managed by an authorised educator or administrator at your childcare service.
          </p>
        </Section>

        <Section title="2. Who may use Portrait Pals">
          <p>Portrait Pals is intended exclusively for:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Qualified early childhood educators who are employed by or contracted to a participating childcare service.</li>
            <li>Parents and legal guardians of children enrolled at a participating childcare service.</li>
          </ul>
          <p>
            You must not share your account credentials with anyone else. Each account is
            personal to you. If you believe your account has been accessed by someone else,
            contact your service administrator immediately.
          </p>
        </Section>

        <Section title="3. Acceptable use">
          <p>You agree to use Portrait Pals only for its intended purpose — documenting genuine
          friendship moments between enrolled children. You must not:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Upload photos of children without the knowledge and consent of the childcare service and the children's parents or guardians.</li>
            <li>Upload any content that is offensive, inappropriate, defamatory, or unlawful.</li>
            <li>Attempt to access another user's account or another child's portraits without authorisation.</li>
            <li>Use the app for any commercial purpose or to promote products or services.</li>
            <li>Attempt to extract, scrape, or reverse-engineer data from the application.</li>
            <li>Use the app in any way that may harm children or their families.</li>
          </ul>
        </Section>

        <Section title="4. Photos and content">
          <p>
            <strong>You retain ownership</strong> of all photos you upload to Portrait Pals.
            By uploading content, you grant Portrait Pals a limited licence to store and display
            that content solely for the purpose of delivering the service to you and the accounts
            linked to your children.
          </p>
          <p>
            This licence does not extend to any third party. We will never use your photos in
            marketing material, share them publicly, or display them to anyone other than the
            linked educator and parent accounts associated with that child.
          </p>
          <p>
            Educators are responsible for ensuring they have appropriate consent from parents
            before uploading photos of children to the platform. This consent should be obtained
            as part of the childcare service's standard enrolment process.
          </p>
        </Section>

        <Section title="5. Privacy and children's data">
          <p>
            Your privacy and the privacy of children is of the utmost importance to us.
            Please read our <strong>Privacy Policy</strong> in full — it sets out exactly
            how we collect, use, and protect your information.
          </p>
          <p>Key commitments in summary:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Your data is never sold or shared with third parties.</li>
            <li>Photos and personal data are never used to train AI or machine learning systems.</li>
            <li>Children's information is accessible only to linked, authorised accounts.</li>
            <li>You may request deletion of all your data at any time.</li>
          </ul>
        </Section>

        <Section title="6. Educator responsibilities">
          <p>Educators using Portrait Pals take on specific responsibilities:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Obtaining appropriate consent from parents before photographing children for upload to the app.</li>
            <li>Ensuring that any notes or observations recorded in the app comply with your service's policies and relevant regulations, including those set by the Department for Child Protection (DCP) or equivalent body in your jurisdiction.</li>
            <li>Only linking parent accounts to the correct children they are authorised to view.</li>
            <li>Promptly deactivating accounts for educators or parents who leave the service.</li>
          </ul>
        </Section>

        <Section title="7. No medical or professional advice">
          <p>
            Portrait Pals is a documentation and communication tool only. Nothing in the app
            constitutes medical, developmental, therapeutic, or professional advice of any kind.
            Observations and notes recorded by educators are informal and personal in nature.
          </p>
        </Section>

        <Section title="8. Service availability">
          <p>
            Portrait Pals is provided as a prototype. We make no guarantee of uptime,
            availability, or fitness for any particular purpose. The service may be modified,
            suspended, or discontinued at any time without notice.
          </p>
          <p>
            We recommend that families do not rely on Portrait Pals as the sole repository
            for irreplaceable photos. Download copies of important memories regularly.
          </p>
        </Section>

        <Section title="9. Limitation of liability">
          <p>
            To the extent permitted by law, Portrait Pals and its creators are not liable for
            any loss or damage arising from your use of the app, including loss of data,
            unauthorised access, or service interruption.
          </p>
          <p>
            Nothing in these terms excludes or limits any rights you have under Australian
            consumer law that cannot be lawfully excluded.
          </p>
        </Section>

        <Section title="10. Changes to these terms">
          <p>
            We may update these Terms &amp; Conditions from time to time. We will notify
            users of material changes before they take effect. Continued use of the app
            after notification constitutes your acceptance of the updated terms.
          </p>
        </Section>

        <Section title="11. Governing law">
          <p>
            These terms are governed by the laws of South Australia and the Commonwealth of
            Australia. Any disputes will be subject to the jurisdiction of the courts of
            South Australia.
          </p>
        </Section>

        <Section title="12. Contact us">
          <p>
            Questions about these terms? Please contact us:
          </p>
          <div className="bg-white rounded-2xl px-4 py-3.5 border border-indigo-100">
            <p className="font-black text-indigo-900">Portrait Pals</p>
            <p>legal@portraitpals.app</p>
            <p className="text-indigo-400 text-xs mt-1">South Australia, Australia</p>
          </div>
        </Section>

        <div className="border-t border-indigo-100 pt-6 text-center">
          <p className="text-xs text-indigo-400 font-semibold">
            This document is a draft intended for legal review before publication.
            It does not constitute legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
