import { Link, createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/Footer'

export const Route = createFileRoute('/privacy')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <section className="max-w-2xl mx-auto px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-400 mb-10">
            What I collect and why - in plain terms. Effective June 2026
          </p>
          <div className="space-y-8 text-slate-300 leading-relaxed">
            <p>
              Cozy Chapter is a personal hobby project created by a solo dev for
              fun, and I collect as little as possible to keep it running.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                What is collected
              </h2>
              <p>
                Your email address and display name when you create an account,
                the content you save in the app (media lists, plant logs,
                notes), and basic technical info like IP address and device type
                that comes standard with any web request. I also use simple,
                privacy-friendly, third-party analytics to see how the app is
                used and to alert me to bugs. Email addresses are not verified —
                if you sign up with an address that isn't really yours, password
                recovery won't work and I won't be able to act on data requests
                for that account (see below).
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                Who I share it with
              </h2>
              <p>
                Nobody, except the service providers that make the app work -
                hosting providers including Neon which is the database provider,
                and analytics - PostHog, who process data on my behalf. I will
                never sell your data or share it with advertisers.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                Your data, your call
              </h2>
              <p>
                You can view and edit your information in the app. For anything
                else — corrections you can't make yourself, a data export, or
                deleting your account entirely — please{' '}
                <Link
                  to="/contact"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                >
                  reach out{' '}
                </Link>
                and I'll take care of it, usually within a few days.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                How I verify requests
              </h2>
              <p>
                To protect your data, I only act on requests I can verify.
                Requests must come from the email address on the account and I
                may (for example where a bogus email was used) ask you to
                confirm through a quick in-app step that only the real account
                holder can do. If I cannot verify a request, I won't act on it.
                This is to stop anyone from deleting or accessing your data. One
                exception: if someone signed up using <em>your</em> email
                address without your permission, contact me from that address
                and I will remove the account. Anyone who does this does so
                knowingly that all data uploaded with an email they didn't have
                the right to use is eligible to have their data removed without
                warning.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                The fine print
              </h2>
              <p>
                The app doesn't respond to browser "Do Not Track" signals. Cozy
                Chapter isn't intended for anyone under 18; it uses third-party
                APIs including Google Books, Spotify, and TMDB, and doesn't
                moderate whether they return age-appropriate titles. I don't
                knowingly collect the data of any minors. If this policy changes
                in a meaningful way, I'll update the date above. Continuing to
                use Cozy Chapter means you meet the age requirement and you're
                okay with the updated version.
              </p>
            </div>
            <p>
              Questions? Please feel free to{' '}
              <Link
                to="/contact"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                reach out
              </Link>
            </p>
          </div>
          <p>Thanks for being here, and I hope you enjoy the cozy space 🫶</p>
        </section>
      </div>
      <Footer />
    </>
  )
}
