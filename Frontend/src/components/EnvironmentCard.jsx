"use client";

import { useRef } from "react";
import { WifiOff } from "lucide-react";
import { useSnowEffect } from "@/hooks/useSnowEffect";
import { PulsingDot } from "@/components/PulsingDot";
import { envIcon } from "@/utils/envIcon";

export default function EnvironmentCard({
  env,
  selected,
  onClick,
  T,
}) {
  const isCold = env?.icon === "snowflake";
  const canvasRef = useRef(null);

  useSnowEffect(canvasRef, selected && isCold);

  const isAlert =
    env?.status === "alert" ||
    env?.status === "danger";

  const tempColor =
    selected && isCold
      ? T.cold.text
      : isAlert
        ? T.accent
        : T.purpleL;

  const borderColor =
    selected && isCold
      ? T.cold.border
      : selected
        ? T.purple
        : isAlert
          ? T.accentDim
          : T.border;

  const bgColor =
    selected && isCold
      ? T.cold.bg
      : selected
        ? T.cardHover
        : T.card;

  const boxShadow = selected
    ? isCold
      ? `0 0 0 1.5px ${T.cold.border}, 0 12px 40px rgba(56,189,248,0.12)`
      : `0 0 0 1.5px ${T.purple}60, 0 12px 40px rgba(124,58,237,0.15)`
    : T.shadow;

const temperature =
  env?.temp ??
  env?.currentTemp;

const humidity =
  env?.humidity ??
  env?.currentHumidity;

const hasTemp =
  temperature !== null &&
  temperature !== undefined;

  let pct = 0;
  let inRange = true;

  if (
    hasTemp &&
    env?.maxTemp !== undefined &&
    env?.minTemp !== undefined &&
    env.maxTemp !== env.minTemp
  ) {
    const range =
      Number(env.maxTemp) -
      Number(env.minTemp);

    pct = Math.min(
      100,
      Math.max(
        0,
        ((Number(temperature) - Number(env.minTemp)) / range)
           *
          100
      )
    );

    inRange =
  Number(temperature) >= Number(env.minTemp) &&
  Number(temperature) <= Number(env.maxTemp);
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border p-4 group"
      style={{
        background: bgColor,
        borderColor,
        boxShadow,
        position: "relative",
        overflow: "hidden",
        transition:
          "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {isCold && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: 16,
            zIndex: 1,
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* TOPO */}
        <div className="flex justify-between mb-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{
              background: `${tempColor}15`,
              border: `1.5px solid ${tempColor}25`,
            }}
          >
            <span style={{ color: tempColor }}>
              {envIcon?.(env?.icon) || "🌡️"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {env?.online ? (
              <>
                <PulsingDot color={tempColor} />
                <span
                  className="text-[9px]"
                  style={{ color: T.muted }}
                >
                  online
                </span>
              </>
            ) : (
              <>
                <WifiOff
                  className="h-3 w-3"
                  style={{ color: T.faint }}
                />
                <span
                  className="text-[9px]"
                  style={{ color: T.faint }}
                >
                  offline
                </span>
              </>
            )}
          </div>
        </div>

        {/* NOME */}
        <p
          className="text-[10px] uppercase truncate"
          style={{ color: T.muted }}
        >
          {env?.name}
        </p>

        {/* TEMPERATURA */}
        <p
          className="text-4xl font-black mt-1"
          style={{ color: tempColor }}
        >
          {hasTemp ? `${temperature}°C` : "—"}
        </p>

        {/* UMIDADE */}
        {env?.humidity !== undefined && (
          <p
            className="text-xs mt-1"
            style={{ color: T.muted }}
          >
            Umidade: {humidity}%
          </p>
        )}

        {/* BARRA */}
        <div className="mt-3">
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{
              background: T.borderSoft,
            }}
          >
            {hasTemp && (
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: inRange
                    ? T.blue
                    : T.accent,
                }}
              />
            )}
          </div>
        </div>

        {/* LIMITES */}
        <div
          className="flex justify-between mt-2 text-[10px]"
          style={{ color: T.muted }}
        >
          <span>{env.minTemp}°C</span>
          <span>{env.maxTemp}°C</span>
        </div>
      </div>
    </button>
  );
}