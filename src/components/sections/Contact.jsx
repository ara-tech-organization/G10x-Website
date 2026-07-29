import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  ChevronDown,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE, VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { company, contact } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { Button } from '@/components/ui/Button'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'

const CHANNEL_ICONS = { Studio: MapPin, 'Phone / WhatsApp': Phone, Email: Mail }

/**
 * Contact, staged as a command room.
 *
 * Three live channels on the left over a radar sweep centred on Thanjavur;
 * the enquiry form on the right. The form is a real, validated, accessible
 * form — it just has no endpoint yet, so it hands off to a prefilled mail
 * draft rather than silently pretending to submit.
 */
export function Contact() {
  return (
    <SectionShell
      id="contact"
      labelledBy="contact-heading"
      className="relative overflow-hidden"
    >
      <RadarBackdrop />

      <div className="relative">
        <div className="max-w-2xl">
          <Eyebrow>{contact.eyebrow}</Eyebrow>
          <SectionTitle id="contact-heading" className="mt-7">
            Let’s Start the{' '}
            <span className="g-gradient-text">Conversation</span>
          </SectionTitle>
        </div>

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          {/* ---- Channels ---------------------------------------------- */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={stagger(0.1)}
            className="flex flex-col gap-4"
          >
            {contact.channels.map((channel, i) => (
              <ChannelCard key={channel.k} channel={channel} index={i} />
            ))}

            {/* Trust chips */}
            <motion.ul variants={fadeUp} className="mt-2 flex flex-wrap gap-2">
              {contact.trustChips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink/[0.03] px-3.5 py-2 text-[0.8125rem] font-medium text-mist"
                >
                  <ArrowGlyph
                    gradient
                    id={`chip-${chip.slice(0, 5)}`}
                    className="size-2"
                  />
                  {chip}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ---- Form ------------------------------------------------- */}
          <EnquiryForm />
        </div>

        {/* ---- Final CTA -------------------------------------------- */}
        <FinalCta />
      </div>
    </SectionShell>
  )
}

/** One reachable channel. */
function ChannelCard({ channel, index }) {
  const Icon = CHANNEL_ICONS[channel.k] ?? MapPin
  const external = channel.href.startsWith('http')

  return (
    <motion.a
      variants={fadeUp}
      href={channel.href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.45, ease: EASE.expo }}
      className="g-panel group relative overflow-hidden rounded-2xl p-6 md:p-7"
    >
      <span
        aria-hidden="true"
        className="g-gradient pointer-events-none absolute -inset-16 opacity-0 blur-[60px] transition-opacity duration-600 group-hover:opacity-12"
      />
      <span
        aria-hidden="true"
        className="g-gradient absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      <div className="relative flex items-start gap-4">
        <span className="relative grid size-11 shrink-0 place-items-center rounded-full border border-ink/12">
          <span
            aria-hidden="true"
            className="g-gradient absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-35"
          />
          <Icon
            className="relative size-4 text-chalk"
            strokeWidth={2.2}
            aria-hidden="true"
          />
        </span>

        <div className="min-w-0 flex-1">
          <span className="g-label text-accent">{channel.k}</span>
          <p className="mt-2 text-[0.9375rem] leading-snug font-semibold text-chalk">
            {channel.value}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-mist transition-colors group-hover:text-chalk">
            {channel.action}
            <ArrowUpRight
              className="size-3.5 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2.4}
              aria-hidden="true"
            />
          </span>
        </div>

        <span
          className="font-mono text-[0.625rem] tracking-[0.24em] text-dim tabular-nums"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </motion.a>
  )
}

/**
 * Enquiry form.
 *
 * Native validation drives the states so it works without JS assumptions, and
 * on submit it opens a prefilled email draft. When a backend endpoint exists,
 * replace the body of `handleSubmit` — nothing else needs to change.
 */
function EnquiryForm() {
  const [status, setStatus] = useState('idle')

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatus('sending')

    const data = new FormData(event.currentTarget)
    const lines = [
      `Name: ${data.get('name')}`,
      `Phone: ${data.get('phone')}`,
      `Email: ${data.get('email') || '—'}`,
      `Service: ${data.get('service')}`,
      '',
      String(data.get('message') || ''),
    ]

    const subject = `New enquiry — ${data.get('service')}`
    const href = `mailto:${company.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(lines.join('\n'))}`

    // Small delay so the button state is perceivable rather than a flicker.
    setTimeout(() => {
      window.location.href = href
      setStatus('sent')
    }, 450)
  }

  return (
    <motion.div
      id="contact-form"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 1, ease: EASE.expo }}
      className="g-panel relative overflow-hidden rounded-3xl p-7 md:p-10"
    >
      <span
        aria-hidden="true"
        className="g-gradient absolute inset-x-0 top-0 h-[1.5px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 size-[26rem] opacity-[0.09] blur-[110px]"
      >
        <div className="g-gradient size-full rounded-full" />
      </div>

      <div className="relative">
        <h3 className="text-[1.125rem] leading-tight font-bold tracking-[-0.03em] text-chalk md:text-[1.3125rem]">
          Book a free strategy call
        </h3>
        <p className="mt-3 text-[0.875rem] leading-relaxed text-mist">
          Tell us what you’re trying to grow. We’ll come back with a plan, not a
          sales script.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" name="name" required autoComplete="name" />
            <Field
              label="Phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
            />
          </div>

          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            hint="Optional"
          />

          <Field label="What do you need?" name="service" as="select">
            {contact.formServices.map((service) => (
              <option key={service} value={service} className="bg-panel">
                {service}
              </option>
            ))}
          </Field>

          <Field
            label="Anything else"
            name="message"
            as="textarea"
            hint="Optional"
          />

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              type="submit"
              size="lg"
              icon={false}
              disabled={status === 'sending'}
              className="w-full sm:w-auto"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Preparing
                </>
              ) : (
                <>
                  <Send className="size-4" strokeWidth={2.4} aria-hidden="true" />
                  Send Enquiry
                </>
              )}
            </Button>

            <p
              className="text-[0.8125rem] leading-relaxed text-dim"
              role="status"
              aria-live="polite"
            >
              {status === 'sent'
                ? 'Your mail app should now be open with the enquiry ready to send.'
                : `Or call us directly on ${company.phone}.`}
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

/**
 * Form field. Label is always rendered (never a placeholder-only field, which
 * disappears the moment a user starts typing), and the focus ring is the
 * brand's own gradient rail.
 */
function Field({
  label,
  name,
  as = 'input',
  hint,
  children,
  className,
  ...rest
}) {
  const id = `field-${name}`
  const hintId = hint ? `${id}-hint` : undefined

  const shared = cn(
    'peer w-full rounded-xl border border-ink/10 bg-ink/[0.025] px-4 py-3.5',
    'text-[0.875rem] text-chalk placeholder:text-dim',
    'transition-colors duration-300 outline-none',
    'hover:border-ink/20 focus:border-brand-pink/70 focus:bg-ink/[0.045]',
    className,
  )

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-3 text-[0.8125rem] font-medium text-mist"
      >
        <span>{label}</span>
        {hint && (
          <span id={hintId} className="text-[0.75rem] text-dim">
            {hint}
          </span>
        )}
      </label>

      {as === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          aria-describedby={hintId}
          className={cn(shared, 'resize-y')}
          {...rest}
        />
      ) : as === 'select' ? (
        // The native arrow is suppressed to match the dark field styling, so a
        // chevron is drawn back in — otherwise nothing signals it opens.
        <div className="relative">
          <select
            id={id}
            name={name}
            aria-describedby={hintId}
            className={cn(shared, 'appearance-none pr-11')}
            {...rest}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-mist"
            strokeWidth={2.2}
            aria-hidden="true"
          />
        </div>
      ) : (
        <input id={id} name={name} aria-describedby={hintId} className={shared} {...rest} />
      )}
    </div>
  )
}

/** Closing call to action — the document's final Home block. */
function FinalCta() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.05, ease: EASE.expo }}
      className="relative mt-6 overflow-hidden rounded-3xl lg:mt-8"
    >
      <div className="g-gradient absolute inset-0" aria-hidden="true" />
      {/* Dark scrim so white type stays comfortably readable on the ramp. */}
      <div className="absolute inset-0 bg-abyss/72" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div className="relative flex flex-col items-start gap-9 p-9 md:p-14 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="max-w-2xl">
          <h3 className="text-[clamp(1.375rem,2.75vw,2.25rem)] leading-[1.02] font-black tracking-[-0.04em] text-chalk">
            {contact.finalHeading}
          </h3>
          <p className="mt-5 max-w-xl text-lead leading-relaxed text-chalk/70">
            {contact.finalBody}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button href="#contact-form" size="lg" variant="outline">
            {contact.ctas[0].label}
          </Button>
          <Button href={company.phoneHref} size="lg" icon={false}>
            <Phone className="size-4" strokeWidth={2.4} aria-hidden="true" />
            {company.phone}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Radar sweep behind the channels — the "animated map" idea, expressed as
 * concentric range rings around a single origin. Honest: G10X has one office,
 * so a world map would be theatre.
 */
function RadarBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute top-1/3 left-[8%] size-[40rem] opacity-[0.055]">
        {/* Range rings */}
        {[1, 0.72, 0.48, 0.26].map((scale, i) => (
          <span
            key={scale}
            className="absolute inset-0 rounded-full border border-brand-violet"
            style={{
              transform: `scale(${scale})`,
              opacity: 1 - i * 0.15,
            }}
          />
        ))}
        {/* Crosshair */}
        <span className="absolute top-1/2 left-0 h-px w-full bg-brand-violet/60" />
        <span className="absolute top-0 left-1/2 h-full w-px bg-brand-violet/60" />
      </div>

      {/* Sweep */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 9, ease: 'linear', repeat: Infinity }}
        className="absolute top-1/3 left-[8%] size-[40rem] opacity-[0.05] motion-reduce:hidden"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(223,74,148,0.7), transparent 32%)',
          borderRadius: '9999px',
        }}
      />
    </div>
  )
}
