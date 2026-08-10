'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  Balloon,
  Binoculars,
  Camera,
  Compass,
  Leaf,
  Luggage,
  MapPin,
  Sailboat,
  Signpost,
  Ticket,
  TreePalm,
} from 'lucide-react';

/**
 * Ambient page backdrop: scrapbook line art — passport stamps, travel motifs and
 * dashed flight paths — over a soft green corner wash.
 *
 * The composition is deliberately *sparse and edge-weighted*: motifs are large and
 * live in the left and right margins so the reading column stays empty. A dense,
 * evenly-tiled pattern reads as wallpaper and fights the content.
 *
 * Rendered once behind the page as a fixed layer at -z-10, so sections above it
 * must be transparent (or barely tinted) for any of it to show.
 */

/** Every value that controls how loud the backdrop is, in one place. */
const MOTIF_OPACITY = 0.1;
const FLIGHT_PATH_OPACITY = 0.11;

/**
 * One repeat of the scatter. Large on purpose, so a viewport only ever holds a
 * handful of marks. `x` is a percentage of the tile so motifs stay pinned to the
 * margins at any screen width.
 */
const TILE = 900;
const MOTIFS = [
  { Icon: Compass, x: 4, y: 70, size: 92, rotate: -8 },
  { Icon: Balloon, x: 84, y: 40, size: 88, rotate: 0 },
  { Icon: Leaf, x: 14, y: 210, size: 58, rotate: -28 },
  { Icon: TreePalm, x: 6, y: 330, size: 78, rotate: 4 },
  { Icon: Camera, x: 86, y: 360, size: 72, rotate: -6 },
  { Icon: Luggage, x: 10, y: 560, size: 80, rotate: 5 },
  { Icon: Signpost, x: 82, y: 610, size: 82, rotate: -4 },
  { Icon: Binoculars, x: 90, y: 176, size: 60, rotate: 8 },
  { Icon: Ticket, x: 3, y: 780, size: 70, rotate: 12 },
  { Icon: Sailboat, x: 88, y: 800, size: 74, rotate: -5 },
  { Icon: MapPin, x: 16, y: 690, size: 46, rotate: 0 },
] as const;

/** Stamps carry text, so they are drawn rather than borrowed from the icon set. */
interface RoundStampSpec {
  /** Percentage of the tile width, resolved to px before drawing. */
  x: number;
  y: number;
  size: number;
  rotate: number;
  top: string;
  bottom: string;
}

interface RectStampSpec {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  title: string;
  lines: string[];
}

const ROUND_STAMPS: RoundStampSpec[] = [
  { x: 74, y: 150, size: 150, rotate: -12, top: 'TRAVEL • ADVENTURE •', bottom: 'EXPLORE MORE' },
  { x: 6, y: 470, size: 132, rotate: 9, top: 'ITALY • ROME •', bottom: 'ARRIVED 2024' },
];

const RECT_STAMPS: RectStampSpec[] = [
  { x: 80, y: 500, width: 150, height: 92, rotate: 8, title: 'PARIS', lines: ['FRANCE', '24 FEB 2024'] },
  { x: 4, y: 60, width: 138, height: 86, rotate: -7, title: 'TOKYO', lines: ['JAPAN', '08 JAN 2024'] },
];

/** Long dashed arcs, drifting. Minutes per loop, so it reads as drift not animation. */
const FLIGHT_PATHS = [
  { d: 'M-60 250 Q 460 60 940 210 T 1520 150', duration: 58, delay: 0 },
  { d: 'M-60 660 Q 520 480 1060 640 T 1520 560', duration: 74, delay: -18 },
] as const;

function RoundStamp({ stamp, index }: { stamp: RoundStampSpec; index: number }) {
  const r = stamp.size / 2;
  const textRadius = r - 13;
  const topArc = `M ${r - textRadius} ${r} a ${textRadius} ${textRadius} 0 1 1 ${textRadius * 2} 0`;
  const bottomArc = `M ${r - textRadius} ${r} a ${textRadius} ${textRadius} 0 1 0 ${textRadius * 2} 0`;

  return (
    <g
      transform={`translate(${stamp.x} ${stamp.y}) rotate(${stamp.rotate} ${r} ${r})`}
      fill="none"
      stroke="currentColor"
    >
      <defs>
        <path id={`tc-stamp-top-${index}`} d={topArc} />
        <path id={`tc-stamp-bottom-${index}`} d={bottomArc} />
      </defs>

      {/* Scalloped outer edge, then the double rule of a real cachet. */}
      <circle cx={r} cy={r} r={r - 1} strokeWidth={2.5} strokeDasharray="5 4" />
      <circle cx={r} cy={r} r={r - 8} strokeWidth={1.4} />
      <circle cx={r} cy={r} r={r - 26} strokeWidth={1.2} />

      <text
        fill="currentColor"
        stroke="none"
        fontSize={r * 0.15}
        fontWeight={700}
        letterSpacing={r * 0.05}
      >
        <textPath href={`#tc-stamp-top-${index}`} startOffset="50%" textAnchor="middle">
          {stamp.top}
        </textPath>
      </text>
      <text
        fill="currentColor"
        stroke="none"
        fontSize={r * 0.13}
        fontWeight={700}
        letterSpacing={r * 0.04}
      >
        <textPath href={`#tc-stamp-bottom-${index}`} startOffset="50%" textAnchor="middle">
          {stamp.bottom}
        </textPath>
      </text>

      {/* Wings across the middle, as passport cachets tend to carry. */}
      <path
        d={`M ${r - 22} ${r} h 44 M ${r - 14} ${r - 6} l 8 6 -8 6 M ${r + 14} ${r - 6} l -8 6 8 6`}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    </g>
  );
}

function RectStamp({ stamp }: { stamp: RectStampSpec }) {
  const { width: w, height: h } = stamp;

  return (
    <g
      transform={`translate(${stamp.x} ${stamp.y}) rotate(${stamp.rotate} ${w / 2} ${h / 2})`}
      fill="none"
      stroke="currentColor"
    >
      <rect x={0} y={0} width={w} height={h} rx={8} strokeWidth={2.5} strokeDasharray="6 4" />
      <rect x={7} y={7} width={w - 14} height={h - 14} rx={5} strokeWidth={1.2} />
      <text
        x={w / 2}
        y={h * 0.44}
        fill="currentColor"
        stroke="none"
        fontSize={h * 0.26}
        fontWeight={800}
        letterSpacing={h * 0.045}
        textAnchor="middle"
      >
        {stamp.title}
      </text>
      {stamp.lines.map((line, i) => (
        <text
          key={line}
          x={w / 2}
          y={h * (0.63 + i * 0.19)}
          fill="currentColor"
          stroke="none"
          fontSize={h * 0.13}
          fontWeight={600}
          letterSpacing={h * 0.03}
          textAnchor="middle"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export default function TravelBackdrop() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Two rates so the stamps sit visibly deeper than the motif layer.
  const stampY = useTransform(scrollY, [0, 4000], [0, -150]);
  const motifY = useTransform(scrollY, [0, 4000], [0, -70]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white"
    >
      {/* Corner light, strongest at the top where the hero sits. Drawn from the
          logo's green scale, not --brand-sage/--brand-clay: those are khaki-warm
          and go dull and beige once faded out over white. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(46rem 30rem at 2% 0%, color-mix(in srgb, var(--logo-pastel) 70%, transparent), transparent 68%)',
            'radial-gradient(44rem 28rem at 98% 2%, color-mix(in srgb, var(--logo-mint) 62%, transparent), transparent 68%)',
            'radial-gradient(40rem 26rem at 100% 96%, color-mix(in srgb, var(--logo-sage-medium) 20%, transparent), transparent 70%)',
            'radial-gradient(36rem 24rem at 0% 100%, color-mix(in srgb, var(--logo-mint) 55%, transparent), transparent 70%)',
          ].join(','),
        }}
      />

      {/* Passport stamps — the deepest scrapbook layer. */}
      <motion.svg
        style={reduceMotion ? undefined : { y: stampY }}
        className="absolute inset-0 h-full w-full text-brand-dark"
        opacity={MOTIF_OPACITY}
      >
        <defs>
          <pattern id="tc-stamps" width={TILE} height={TILE} patternUnits="userSpaceOnUse">
            {ROUND_STAMPS.map((stamp, index) => (
              <RoundStamp
                key={index}
                index={index}
                stamp={{ ...stamp, x: (stamp.x / 100) * TILE }}
              />
            ))}
            {RECT_STAMPS.map((stamp, index) => (
              <RectStamp key={index} stamp={{ ...stamp, x: (stamp.x / 100) * TILE }} />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tc-stamps)" />
      </motion.svg>

      {/* Travel motifs, held to the margins. */}
      <motion.svg
        style={reduceMotion ? undefined : { y: motifY }}
        className="absolute inset-0 h-full w-full text-brand-dark"
        opacity={MOTIF_OPACITY}
      >
        <defs>
          <pattern id="tc-motifs" width={TILE} height={TILE} patternUnits="userSpaceOnUse">
            {MOTIFS.map(({ Icon, x, y, size, rotate }, index) => (
              <g
                key={index}
                transform={`translate(${(x / 100) * TILE} ${y}) rotate(${rotate}) scale(${size / 24})`}
              >
                <Icon width={24} height={24} strokeWidth={1.1} />
              </g>
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tc-motifs)" />
      </motion.svg>

      {/* Dashed flight paths, drifting. */}
      <svg
        className="absolute inset-0 h-full w-full text-brand-dark"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        opacity={FLIGHT_PATH_OPACITY}
      >
        {FLIGHT_PATHS.map((path, index) => (
          <path
            key={index}
            d={path.d}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="1 12"
            className={reduceMotion ? undefined : 'tc-flight-path'}
            style={{ animationDuration: `${path.duration}s`, animationDelay: `${path.delay}s` }}
          />
        ))}
      </svg>

      <style jsx global>{`
        .tc-flight-path {
          animation-name: tc-flight-drift;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        /* One dash cycle is 13 units; drifting a large multiple of it keeps the
           loop seamless — the dots never visibly jump back to the start. */
        @keyframes tc-flight-drift {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -1300;
          }
        }
      `}</style>
    </div>
  );
}
