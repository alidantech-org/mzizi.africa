"use client";
/**
 * The control set. Every form control in the app comes from here, so selects, checkboxes, switches, sliders and
 * text fields look and behave the same everywhere. Built on React Aria for keyboard, focus and screen-reader behaviour.
 */
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useState, type ReactNode, type Ref } from "react";
import {
  Button,
  Checkbox as RCheckbox,
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as RSelect,
  SelectValue,
  Slider as RSlider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  Switch as RSwitch,
} from "react-aria-components";

const NONE = "__none__";
const focusRing =
  "outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-accent data-[focus-visible]:ring-offset-1 data-[focus-visible]:ring-offset-surface";

/* ---------- Select (with search for long lists) ---------- */
export type Option = { id: string; label: string; hint?: string };

const optionClass = ({ isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }) =>
  `flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none ${isFocused ? "bg-accent-soft" : ""} ${isSelected ? "font-medium" : ""}`;

/** Label with an optional hint under it, and a check on the chosen one. */
function OptionBody({ o, isSelected }: { o: Option; isSelected: boolean }) {
  return (
    <>
      <span className="min-w-0 truncate">{o.label}</span>
      {o.hint && (
        <span className="ml-auto hidden min-w-0 shrink truncate text-xs font-normal text-muted @sm:inline">{o.hint}</span>
      )}
      {isSelected && o.id !== NONE && <Check size={14} className="ml-auto shrink-0 text-accent" />}
    </>
  );
}

function Options({ options, clearLabel }: { options: Option[]; clearLabel?: string }) {
  const all = clearLabel ? [{ id: NONE, label: clearLabel }, ...options] : options;
  return (
    <>
      {all.map((o) => (
        <ListBoxItem key={o.id} id={o.id} textValue={o.label} className={optionClass}>
          {({ isSelected }) => <OptionBody o={o} isSelected={isSelected} />}
        </ListBoxItem>
      ))}
    </>
  );
}

const popover =
  "@container floating z-[100] w-(--trigger-width) min-w-48 overflow-hidden rounded-lg border border-line bg-surface p-1";
const trigger =
  "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-line bg-surface px-3 text-left text-sm transition hover:border-muted data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[focus-visible]:border-accent data-[open]:border-accent";

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Choose",
  clearLabel,
  searchable,
  disabled,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  options: Option[];
  placeholder?: string;
  clearLabel?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const t = useCopy();
  const key = value || (clearLabel ? NONE : null);
  const change = (k: string | number | null) => onChange(k == null || k === NONE ? "" : String(k));
  const chosen = options.find((o) => o.id === value)?.label ?? "";
  const [text, setText] = useState(chosen);
  const [dirty, setDirty] = useState(false); // the reader has typed since the last choice
  useEffect(() => {
    setText(chosen);
    setDirty(false);
  }, [chosen]);

  if (searchable) {
    const q = text.trim().toLowerCase();
    const items = [
      ...(clearLabel ? [{ id: NONE, label: clearLabel }] : []),
      ...options.filter((o) => !dirty || !q || o.label.toLowerCase().includes(q)),
    ];
    return (
      <ComboBox
        aria-label={label}
        className={`group ${className}`}
        selectedKey={key}
        onSelectionChange={(k) => {
          setDirty(false);
          change(k);
        }}
        inputValue={text}
        onInputChange={(v) => {
          setText(v);
          setDirty(true);
        }}
        isDisabled={disabled}
        menuTrigger="focus"
        allowsEmptyCollection
        items={items}
      >
        <div className="relative flex h-10 w-full items-center rounded-md border border-line bg-surface transition focus-within:border-accent hover:border-muted group-data-[disabled]:opacity-50">
          <Input
            placeholder={placeholder}
            onFocus={(e) => {
              if (!dirty) e.target.select();
            }}
            className="h-full w-full rounded-md bg-transparent pl-3 pr-9 text-sm outline-none placeholder:text-muted"
          />
          <Button className={`absolute right-1 top-1 grid size-8 place-items-center rounded text-muted ${focusRing}`}>
            <ChevronDown size={16} />
          </Button>
        </div>
        <Popover className={popover}>
          <ListBox
            className="max-h-60 overflow-y-auto outline-none"
            renderEmptyState={() => <div className="px-3 py-3 text-sm text-muted">{t(copy.common.nothingMatches)}</div>}
          >
            {(o: Option) => (
              <ListBoxItem id={o.id} textValue={o.label} className={optionClass}>
                {({ isSelected }) => <OptionBody o={o} isSelected={isSelected} />}
              </ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </ComboBox>
    );
  }
  return (
    <RSelect
      aria-label={label}
      className={className}
      selectedKey={key}
      onSelectionChange={change}
      isDisabled={disabled}
      placeholder={placeholder}
    >
      <Button className={trigger}>
        <SelectValue className="truncate data-[placeholder]:text-muted">
          {({ selectedText, isPlaceholder }) => (isPlaceholder ? placeholder : selectedText)}
        </SelectValue>
        <ChevronDown size={16} className="shrink-0 text-muted" />
      </Button>
      <Popover className={popover}>
        <ListBox className="max-h-60 overflow-y-auto outline-none">
          <Options options={options} clearLabel={clearLabel} />
        </ListBox>
      </Popover>
    </RSelect>
  );
}

/* ---------- Checkbox ---------- */
export function Checkbox({
  children,
  selected,
  onChange,
  disabled,
  size = "md",
}: {
  children: ReactNode;
  selected: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "size-3.5 rounded-[3px]" : "size-[18px] rounded";
  return (
    <RCheckbox
      isSelected={selected}
      onChange={onChange}
      isDisabled={disabled}
      className={`group flex cursor-pointer items-center ${size === "sm" ? "gap-1.5 text-xs" : "gap-2.5 text-sm"} data-[disabled]:opacity-50`}
    >
      {({ isSelected, isFocusVisible }) => (
        <>
          <span
            className={`grid ${box} shrink-0 place-items-center border transition ${isSelected ? "border-accent bg-accent text-paper" : "border-muted bg-surface group-hover:border-ink"} ${isFocusVisible ? "ring-2 ring-accent ring-offset-1 ring-offset-surface" : ""}`}
          >
            {isSelected && <Check size={size === "sm" ? 10 : 13} strokeWidth={3} />}
          </span>
          {children}
        </>
      )}
    </RCheckbox>
  );
}

/* ---------- Switch ---------- */
export function Switch({
  children,
  selected,
  onChange,
  disabled,
}: {
  children: ReactNode;
  selected: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <RSwitch
      isSelected={selected}
      onChange={onChange}
      isDisabled={disabled}
      className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-accent-soft data-[disabled]:opacity-50"
    >
      {({ isSelected, isFocusVisible }) => (
        <>
          <span>{children}</span>
          <span
            className={`relative h-5 w-9 shrink-0 rounded-full border transition ${isSelected ? "border-accent bg-accent" : "border-muted bg-line"} ${isFocusVisible ? "ring-2 ring-accent ring-offset-1 ring-offset-surface" : ""}`}
          >
            <span
              className={`absolute top-0.5 size-3.5 rounded-full transition-all ${isSelected ? "left-[18px] bg-paper" : "left-0.5 bg-muted"}`}
            />
          </span>
        </>
      )}
    </RSwitch>
  );
}

/* ---------- Slider ---------- */
export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
}) {
  return (
    <RSlider aria-label={label} value={value} onChange={onChange} minValue={min} maxValue={max} step={step} className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs text-muted">
        <Label>{label}</Label>
        <SliderOutput className="font-mono">
          {({ state }) => (format ? format(state.values[0]) : String(state.values[0]))}
        </SliderOutput>
      </div>
      <SliderTrack className="relative h-5 w-full">
        {({ state }) => (
          <>
            <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-line" />
            <div
              className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-accent"
              style={{ width: `${state.getThumbPercent(0) * 100}%` }}
            />
            <SliderThumb
              className={({ isDragging, isFocusVisible }) =>
                `top-1/2 size-4 rounded-full border-2 border-accent bg-surface transition ${isDragging ? "scale-110" : ""} ${isFocusVisible ? "ring-2 ring-accent ring-offset-2 ring-offset-surface" : ""} outline-none`
              }
            />
          </>
        )}
      </SliderTrack>
    </RSlider>
  );
}

/* ---------- Text field ---------- */
/** One bordered field: optional icon, the input, and a clear button. The wrapper shows focus, so there is a single outline. */
export function TextField({
  value,
  onChange,
  placeholder,
  label,
  icon,
  clearable = true,
  autoFocus,
  onKeyDown,
  inputRef,
  className = "",
  size = "md",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label: string;
  icon?: ReactNode;
  clearable?: boolean;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: Ref<HTMLInputElement>;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const t = useCopy();
  const h = { sm: "h-8 text-xs", md: "h-10 text-sm", lg: "h-12 text-base" }[size];
  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-line bg-surface px-3 transition focus-within:border-accent hover:border-muted ${h} ${className}`}
    >
      {icon && <span className="shrink-0 text-muted">{icon}</span>}
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label={label}
        className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
      />
      {clearable && value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={t(copy.common.clear)}
          className="grid size-5 shrink-0 place-items-center rounded text-muted hover:bg-accent-soft hover:text-ink"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
