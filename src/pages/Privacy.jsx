import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldOff, Sparkles, Trash2 } from 'lucide-react';

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

function Commitment({ icon: Icon, iconBg, iconColor, title, body }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex gap-3">
      <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={17} className={iconColor} />
      </div>
      <div>
        <p className="font-black text-white text-sm">{title}</p>
        <p className="text-indigo-300 text-xs mt-0.5 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

export default function Privacy() {
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
            <h1 className="font-black text-indigo-900 text-lg leading-tight">Privacy Policy</h1>
            <p className="text-xs text-indigo-400 font-semibold">Last updated {LAST_UPDATED}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8">

        {/* Plain-English commitments at the top */}
        <div className="bg-indigo-900 rounded-3xl p-5 mb-8">
          <p className="font-black text-white text-base mb-1">Our promise to your family</p>
          <p className="text-indigo-300 text-xs font-semibold mb-4">
            Before the legal language — here is what we commit to in plain English.
          </p>
          <div className="space-y-3">
            <Commitment
              icon={Lock}      iconBg="bg-teal-500/20"   iconColor="text-teal-300"
              title="Your photos stay yours"
              body="Photos and children's information are only ever visible to the specific educator or parent accounts they are linked to. No one else can see them."
            />
            <Commitment
              icon={ShieldOff} iconBg="bg-rose-500/20"   iconColor="text-rose-300"
              title="Your data is never sold"
              body="We do not sell, rent, trade, or monetise your personal information or your children's photos — ever. Full stop."
            />
            <Commitment
              icon={Sparkles}  iconBg="bg-violet-500/20" iconColor="text-violet-300"
              title="No AI training on your images"
              body="Photos and personal data uploaded to Portrait Pals are never used to train, fine-tune, or improve any artificial intelligence or machine learning model."
            />
            <Commitment
              icon={Trash2}    iconBg="bg-amber-500/20"  iconColor="text-amber-300"
              title="Delete anytime, completely"
              body="You can request deletion of your account and all associated data at any time. We will remove it fully within 30 days."
            />
          </div>
        </div>

        {/* Full policy */}
        <Section title="1. Who we are">
          <p>
            Portrait Pals is a prototype application designed to help early childhood educators and
            families document and celebrate children's friendships. This Privacy Policy explains how
            we collect, use, store, and protect your information.
          </p>
          <p>
            This policy is governed by the <strong>Australian Privacy Act 1988 (Cth)</strong> and
            the Australian Privacy Principles (APPs). We take our obligations under this legislation
            seriously, particularly because our service involves information about children.
          </p>
        </Section>

        <Section title="2. Information we collect">
          <p>We collect only what is necessary to provide the service:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Account information</strong> — email address and password (stored as a secure hash) for educators and parents.</li>
            <li><strong>Children's profiles</strong> — first name, date of birth (optional), room assignment, and profile photo (optional).</li>
            <li><strong>Portrait photos</strong> — photos captured or uploaded within the app, along with date, notes, and tagged children.</li>
            <li><strong>Usage data</strong> — basic, anonymised information about how the app is used (page visits, errors) to improve reliability. No personally identifiable usage data is retained.</li>
          </ul>
          <p>
            We do <strong>not</strong> collect location data, device identifiers, advertising IDs,
            biometric data, or any information beyond what is listed above.
          </p>
        </Section>

        <Section title="3. How we use your information">
          <p>Your information is used solely to provide the Portrait Pals service:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To authenticate your account and display the correct content to you.</li>
            <li>To show parents the portraits and profiles linked to their children.</li>
            <li>To allow educators to manage children's profiles and capture friendship portraits.</li>
            <li>To display children's ages in portrait memories (calculated locally from date of birth).</li>
          </ul>
          <p>
            We will never use your information for advertising, profiling, analytics sold to
            third parties, or any purpose beyond operating this service.
          </p>
        </Section>

        <Section title="4. Children's privacy">
          <p>
            We recognise that children's information requires the highest level of protection.
            All children's data — including names, photos, and birthdates — is treated as
            sensitive information under the Australian Privacy Act.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Children's profiles are only accessible to the educator account that manages them and the specific parent accounts linked to them.</li>
            <li>No child's photo or personal information is publicly accessible.</li>
            <li>Children's images are never shared with, or visible to, unlinked accounts.</li>
            <li>No child's information is used for any commercial purpose.</li>
          </ul>
          <p>
            Parents and guardians may request to view, correct, or delete all information
            held about their child at any time.
          </p>
        </Section>

        <Section title="5. Data storage and security">
          <p>
            Portrait Pals currently stores data locally on your device using your browser's
            localStorage. In production, data would be stored on servers located in Australia
            using encrypted connections (TLS/HTTPS). We implement reasonable technical
            safeguards to protect against unauthorised access, disclosure, or loss.
          </p>
          <p>
            No system is perfectly secure. In the unlikely event of a data breach that affects
            your personal information, we will notify you as required under the Notifiable Data
            Breaches scheme.
          </p>
        </Section>

        <Section title="6. What we will never do">
          <p>We make the following absolute commitments:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>We will <strong>never sell</strong> your personal information or children's data to any third party.</li>
            <li>We will <strong>never share</strong> your data with advertisers, data brokers, or analytics companies.</li>
            <li>We will <strong>never use</strong> photos, names, or any personal data to train, test, or improve any artificial intelligence or machine learning system.</li>
            <li>We will <strong>never publish</strong> or display children's photos or profiles publicly.</li>
            <li>We will <strong>never transfer</strong> your data outside of Australia without your explicit consent.</li>
          </ul>
        </Section>

        <Section title="7. Data retention and deletion">
          <p>
            We retain your data only for as long as your account is active and the service is
            in use. You may request full deletion of your account and all associated data —
            including children's profiles and photos — at any time.
          </p>
          <p>
            Deletion requests will be fulfilled within <strong>30 days</strong>. Following
            deletion, no recoverable copy of your data will be retained by us.
          </p>
        </Section>

        <Section title="8. Your rights">
          <p>Under the Australian Privacy Act, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Access the personal information we hold about you or your child.</li>
            <li>Request correction of inaccurate or out-of-date information.</li>
            <li>Request deletion of your information.</li>
            <li>Complain about how we handle your information.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us using the details below. We will
            respond within 30 days.
          </p>
        </Section>

        <Section title="9. Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time. Material changes will be
            communicated to users before they take effect. Continued use of the app after
            notification constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="10. Contact us">
          <p>
            For any privacy-related questions, concerns, or requests, please contact us at:
          </p>
          <div className="bg-white rounded-2xl px-4 py-3.5 border border-indigo-100">
            <p className="font-black text-indigo-900">Portrait Pals</p>
            <p>privacy@portraitpals.app</p>
            <p className="text-indigo-400 text-xs mt-1">South Australia, Australia</p>
          </div>
          <p>
            If you are not satisfied with our response, you may lodge a complaint with the
            Office of the Australian Information Commissioner (OAIC) at{' '}
            <span className="text-indigo-500 font-semibold">oaic.gov.au</span>.
          </p>
        </Section>

        <div className="border-t border-indigo-100 pt-6 text-center">
          <p className="text-xs text-indigo-400 font-semibold">
            This policy is a draft document intended for legal review before publication.
            It does not constitute legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
