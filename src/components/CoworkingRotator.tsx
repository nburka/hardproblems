'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  coworkingTeams,
  type CoworkingTeam
} from '../lib/coworkingTeams';
import styles from '../app/articles/page.module.scss';

const VISIBLE_COUNT = 12;
const SWAP_INTERVAL_MS = 3000;
const FADE_MS = 600;

type Tile = {
  team: CoworkingTeam;
  visible: boolean;
};

// 3x3 grid that initially shows the first 9 teams, then periodically
// swaps one tile out for an off-screen team. Each swap fades the tile
// down to opacity 0, replaces the team, and fades it back in.
export default function CoworkingRotator() {
  const [tiles, setTiles] = useState<Tile[]>(() =>
    coworkingTeams.slice(0, VISIBLE_COUNT).map((team) => ({
      team,
      visible: true
    }))
  );

  // Mirror the latest tiles in a ref so the interval can read the
  // current state without re-creating itself on every render.
  const tilesRef = useRef(tiles);
  useEffect(() => {
    tilesRef.current = tiles;
  });

  useEffect(() => {
    // Companies waiting to rotate in — starts with everyone not in
    // the initial 9, refills from the off-screen set when empty.
    let queue: CoworkingTeam[] = coworkingTeams.slice(VISIBLE_COUNT);
    // Don't swap the same tile twice in a row.
    let lastTileIndex = -1;

    const cycle = () => {
      if (queue.length === 0) {
        const visibleHrefs = new Set(
          tilesRef.current.map((t) => t.team.href)
        );
        queue = coworkingTeams.filter((t) => !visibleHrefs.has(t.href));
        if (queue.length === 0) return;
      }

      let tileIndex: number;
      do {
        tileIndex = Math.floor(Math.random() * VISIBLE_COUNT);
      } while (tileIndex === lastTileIndex && VISIBLE_COUNT > 1);
      lastTileIndex = tileIndex;

      const newTeam = queue.shift()!;

      // Phase 1: fade the chosen tile out.
      setTiles((prev) =>
        prev.map((t, i) =>
          i === tileIndex ? { ...t, visible: false } : t
        )
      );

      // Phase 2: once it's invisible, swap the team and fade in.
      setTimeout(() => {
        setTiles((prev) =>
          prev.map((t, i) =>
            i === tileIndex ? { team: newTeam, visible: true } : t
          )
        );
      }, FADE_MS);
    };

    const interval = setInterval(cycle, SWAP_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <ul className={styles.coworkingAsideList}>
      {tiles.map((tile, i) => (
        <li key={i}>
          <Link
            href={tile.team.href}
            aria-label={`Visit ${tile.team.name}`}
            className={styles.coworkingAsideLink}
            style={{
              opacity: tile.visible ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease`
            }}
          >
            {tile.team.image && (
              <Image
                src={tile.team.image}
                width={160}
                height={160}
                alt=""
                className={styles.coworkingAsideThumb}
              />
            )}
            <span className={styles.coworkingAsideTooltip} role="tooltip">
              <strong className={styles.coworkingAsideTooltipName}>
                {tile.team.name} —
              </strong>{' '}
              {tile.team.description}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
