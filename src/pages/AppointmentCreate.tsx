import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Stepper from "../components/ui/Stepper";
import { page, stack, section, grid2, rowBetween, grid3 } from "../styles/layout";
// FIXED: added 'emptyState' to imports
import { button, buttonPrimary, buttonGhost, divider, h2, input, label, muted, emptyState } from "../styles/ui";

// use shared appointment state
import { useAppointments } from "../state/appointments";
import { useUser } from "../state/user";

// Email service
// import { sendAppointmentConfirmation } from "../services/emailService";

type Topic = { id: string; name: string; icon: string };
type Branch = { id: string; name: string; topicIds: string[] };
// slots are global and booked state is derived from appointments
type Slot = { id: string; dateISO: string; dateLabel: string; timeLabel: string; startAt: Date };
type TopicInfo = {
  overview: string;
  typicalHelp: string;
  suggestedDuration: string;
};

// ADDED: More options (Investments, Notary)
const topics: Topic[] = [
  { id: "t1", name: "Open a new account", icon: "✨" },
  { id: "t2", name: "Credit card support", icon: "💳" },
  { id: "t3", name: "Loan consultation", icon: "🏠" },
  { id: "t4", name: "Wealth Management", icon: "📈" },
  { id: "t5", name: "Notary Services", icon: "✒️" }
];

const topicInfoById: Record<string, TopicInfo> = {
  t1: {
    overview: "Open new checking, savings, or student accounts with the right product mix.",
    typicalHelp: "Identity verification, account options, and online banking setup.",
    suggestedDuration: "30 minutes",
  },
  t2: {
    typicalHelp: "Card activation, disputed transactions, and limit/payment guidance.",
    overview: "Get support for card issues, replacements, fraud review, or spending controls.",
    suggestedDuration: "20-30 minutes",
  },
  t3: {
    overview: "Discuss mortgage, auto, or personal loan options and qualification steps.",
    typicalHelp: "Rate comparison, required documents, and next-step planning.",
    suggestedDuration: "45 minutes",
  },
  t4: {
    overview: "Review savings goals, investment planning, and risk-aligned portfolio options.",
    typicalHelp: "Goal planning, account types, and long-term strategy conversations.",
    suggestedDuration: "45-60 minutes",
  },
  t5: {
    overview: "In-branch notarization support for eligible forms and official signatures.",
    typicalHelp: "Document checks, signer verification, and witness requirements.",
    suggestedDuration: "15-30 minutes",
  },
};

// ADDED: New 'North Branch'
const branches: Branch[] = [
  { id: "b1", name: "Downtown Branch", topicIds: ["t1", "t2", "t3", "t4"] },
  { id: "b2", name: "Westside Branch", topicIds: ["t2", "t3", "t5"] },
  { id: "b3", name: "Eastside Branch", topicIds: ["t1", "t4", "t5"] },
  { id: "b4", name: "North Hills (HQ)", topicIds: ["t1", "t2", "t3", "t4", "t5"] },
];

const DATE_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const TIME_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const BRANCH_DAYS: Record<string, number[]> = {
  b1: [1, 2, 3, 4, 5],
  b2: [1, 2, 3, 4, 5],
  b3: [1, 2, 3, 4, 5, 6],
  b4: [1, 2, 3, 4, 5, 6],
};

const BRANCH_TIMES: Record<string, string[]> = {
  b1: ["09:00", "09:30", "10:00", "10:30", "11:00", "13:30", "14:00", "14:30", "15:00"],
  b2: ["09:30", "10:00", "11:00", "13:00", "13:30", "14:00", "15:00"],
  b3: ["10:00", "10:30", "11:00", "13:00", "13:30", "14:00"],
  b4: ["09:00", "09:30", "10:00", "10:30", "11:00", "13:00", "13:30", "14:00", "14:30", "15:00", "16:00"],
};

const TOPIC_TIMES: Record<string, string[]> = {
  t1: ["09:00", "09:30", "10:00", "10:30", "11:00", "13:00", "13:30", "14:00"],
  t2: ["09:30", "10:00", "10:30", "11:00", "13:30", "14:00", "14:30", "15:00"],
  t3: ["10:00", "11:00", "13:00", "14:00", "15:00"],
  t4: ["10:00", "11:00", "13:30", "14:30", "15:00", "16:00"],
  t5: ["09:30", "10:00", "10:30", "11:00", "13:00", "13:30"],
};

function toDateISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateISO(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function withTime(baseDate: Date, hhmm: string) {
  const [hour, minute] = hhmm.split(":").map(Number);
  const next = new Date(baseDate);
  next.setHours(hour || 0, minute || 0, 0, 0);
  return next;
}

function buildAvailableSlots(topicId: string, branchId: string, bookedIds: Set<string>) {
  if (!topicId || !branchId) return [];

  const branchTimes = BRANCH_TIMES[branchId] ?? [];
  const topicTimes = TOPIC_TIMES[topicId] ?? [];
  const compatibleTimes = branchTimes.filter((time) => topicTimes.includes(time));
  const branchOpenDays = BRANCH_DAYS[branchId] ?? [1, 2, 3, 4, 5];
  const now = new Date();
  const minLeadTime = 30 * 60 * 1000;

  const generated: Slot[] = [];
  for (let dayOffset = 0; dayOffset < 21; dayOffset += 1) {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(now.getDate() + dayOffset);

    if (!branchOpenDays.includes(date.getDay())) continue;

    for (const time of compatibleTimes) {
      const startAt = withTime(date, time);
      if (startAt.getTime() < now.getTime() + minLeadTime) continue;

      const dateISO = toDateISO(startAt);
      const id = `${branchId}-${dateISO}-${time}`;
      if (bookedIds.has(id)) continue;

      generated.push({
        id,
        dateISO,
        dateLabel: DATE_LABEL_FORMATTER.format(startAt),
        timeLabel: TIME_LABEL_FORMATTER.format(startAt),
        startAt,
      });
    }
  }

  return generated;
}

type StepId = "topic" | "branch" | "time" | "details" | "confirm";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AppointmentCreate() {
  const navigate = useNavigate();

  const steps = ["Topic", "Branch", "Time", "Details", "Confirm"];
  const [step, setStep] = useState<StepId>("topic");

  const [topicId, setTopicId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [selectedDateISO, setSelectedDateISO] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [showAllBranches, setShowAllBranches] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoTopicId, setInfoTopicId] = useState("");

  const { appointments, addAppointment } = useAppointments();
  const { account, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/account/create");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!account) return;
    setCustomerName(account.fullName);
    setCustomerEmail(account.email);
  }, [account]);

  const currentIndex = useMemo(() => {
    if (step === "topic") return 0;
    if (step === "branch") return 1;
    if (step === "time") return 2;
    if (step === "details") return 3;
    return 4;
  }, [step]);

  const selectedTopic = useMemo(() => topics.find((t) => t.id === topicId) ?? null, [topicId]);
  const availableBranches = useMemo(() => {
    if (!topicId) return [];
    return branches.filter((b) => b.topicIds.includes(topicId));
  }, [topicId]);
  const visibleBranches = useMemo(() => {
    if (!topicId) return [];
    return showAllBranches ? branches : availableBranches;
  }, [topicId, showAllBranches, availableBranches]);

  const selectedBranch = useMemo(() => branches.find((b) => b.id === branchId) ?? null, [branchId]);
  const selectedBranchSupportsTopic = useMemo(() => {
    if (!selectedBranch || !topicId) return false;
    return selectedBranch.topicIds.includes(topicId);
  }, [selectedBranch, topicId]);
  const selectedInfoTopic = useMemo(() => topics.find((t) => t.id === infoTopicId) ?? null, [infoTopicId]);
  const isNameValid = customerName.trim().length > 0;
  const isEmailValid = emailPattern.test(customerEmail.trim());
  const showNameError = nameTouched && !isNameValid;
  const showEmailError = emailTouched && !isEmailValid;
  const hasUnsavedChanges =
    Boolean(topicId) ||
    Boolean(branchId) ||
    Boolean(slotId) ||
    customerName.trim().length > 0 ||
    customerEmail.trim().length > 0 ||
    appointmentNotes.trim().length > 0;

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsavedChanges]);

  // compute what slots are actually available by checking branch and booked appointments
  const availableSlots = useMemo(() => {
    const bookedIds = new Set(appointments.map((a) => a.slotId));
    return buildAvailableSlots(topicId, branchId, bookedIds);
  }, [appointments, topicId, branchId]);
  const selectedSlot = useMemo(() => availableSlots.find((s) => s.id === slotId) ?? null, [availableSlots, slotId]);
  const availableDates = useMemo(
    () => [...new Set(availableSlots.map((s) => s.dateISO))],
    [availableSlots]
  );
  const slotsForSelectedDate = useMemo(
    () => availableSlots.filter((s) => s.dateISO === selectedDateISO),
    [availableSlots, selectedDateISO]
  );
  const selectedDateMonthLabel = useMemo(() => {
    if (!selectedDateISO) return MONTH_YEAR_FORMATTER.format(new Date());
    return MONTH_YEAR_FORMATTER.format(fromDateISO(selectedDateISO));
  }, [selectedDateISO]);

  useEffect(() => {
    if (availableDates.length === 0) {
      setSelectedDateISO("");
      setSlotId("");
      return;
    }

    if (!availableDates.includes(selectedDateISO)) {
      setSelectedDateISO(availableDates[0]);
    }

    if (slotId && !availableSlots.some((s) => s.id === slotId)) {
      setSlotId("");
    }
  }, [availableDates, selectedDateISO, slotId, availableSlots]);

  function goNext() {
    if (step === "topic") setStep("branch");
    else if (step === "branch") setStep("time");
    else if (step === "time") setStep("details");
    else if (step === "details") setStep("confirm");
  }

  function goBack() {
    if (step === "confirm") setStep("details");
    else if (step === "details") setStep("time");
    else if (step === "time") setStep("branch");
    else if (step === "branch") setStep("topic");
  }

  const canNext =
    (step === "topic" && !!topicId) ||
    (step === "branch" && !!branchId && selectedBranchSupportsTopic) ||
    (step === "time" && !!slotId) ||
    (step === "details" && isNameValid && isEmailValid) ||
    step === "confirm";

  function confirmDiscardProgress() {
    if (!hasUnsavedChanges) return true;
    return window.confirm("You have unsaved changes. Leave this page and lose your progress?");
  }

  async function submitMock() {
    if (!selectedTopic || !selectedBranch || !selectedSlot) return;
    if (!isNameValid || !isEmailValid) return;

    setIsSubmitting(true);

    try {
      const newAppt = await addAppointment({
        topicId: selectedTopic.id,
        topicName: selectedTopic.name,
        topicIcon: selectedTopic.icon,
        branchId: selectedBranch.id,
        branchName: selectedBranch.name,
        slotId: selectedSlot.id,
        startAtISO: selectedSlot.startAt.toISOString(),
        dateLabel: selectedSlot.dateLabel,
        timeLabel: selectedSlot.timeLabel,
        customerName: customerName.trim(),
        customerEmail: account!.email,
        notes: appointmentNotes.trim(),
      });

      // Email is sent automatically by the backend

      // reset form just in case user returns
      setTopicId("");
      setBranchId("");
      setSlotId("");
      setCustomerName("");
      setCustomerEmail("");
      setAppointmentNotes("");
      setNameTouched(false);
      setEmailTouched(false);
      setInfoTopicId("");
      setIsSubmitting(false);

      navigate(`/appointments/${newAppt.id}`);
    } catch (error) {
      console.error("Failed to create appointment:", error);
      setIsSubmitting(false);
      // TODO: Show error to user
    }
  }

  // Tile styling helper
  const getTileStyle = (isSelected: boolean) =>
    `flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all cursor-pointer select-none caret-transparent ${
      isSelected
        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-offset-2 shadow-md dark:border-blue-400 dark:bg-slate-800/90 dark:ring-blue-400/70 dark:ring-offset-0 dark:shadow-sm dark:shadow-black/30"
        : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-400/70 dark:hover:shadow-sm dark:hover:shadow-black/25"
    }`;

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Book an Appointment"
          subtitle="Follow the steps below to schedule a meeting with our banking specialists."
          right={
            <Link
              to="/appointments"
              className={buttonGhost}
              onClick={(event) => {
                if (confirmDiscardProgress()) return;
                event.preventDefault();
              }}
            >
              Cancel
            </Link>
          }
        />

        <Stepper steps={steps} currentIndex={currentIndex} />

        {step === "topic" ? (
          <Card>
            <div className={section}>
              <div>
                <div className={h2}>1. What can we help you with?</div>
                <div className={muted}>Choose a topic. Tap the info icon to preview details.</div>
              </div>

              <div className={grid2}>
                {topics.map((t) => {
                  return (
                    <div
                      key={t.id}
                      className={getTileStyle(t.id === topicId)}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setTopicId(t.id);
                        setBranchId("");
                        setSlotId("");
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setTopicId(t.id);
                          setBranchId("");
                          setSlotId("");
                        }
                      }}
                    >
                      <div className="flex w-full items-start justify-between gap-3">
                        <div className="text-2xl">{t.icon}</div>
                        <button
                          type="button"
                          title={`Learn about ${t.name}`}
                          aria-label={`Learn about ${t.name}`}
                          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                            infoTopicId === t.id
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setInfoTopicId((current) => (current === t.id ? "" : t.id));
                          }}
                        >
                          i
                        </button>
                      </div>
                      <div
                        className={`font-semibold ${
                          t.id === topicId
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {t.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedInfoTopic ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/35">
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-semibold text-blue-900 dark:text-blue-100">
                      {selectedInfoTopic.icon} {selectedInfoTopic.name}
                    </div>
                    <button
                      type="button"
                      className="text-sm font-medium text-blue-700 hover:text-blue-900 dark:text-blue-200 dark:hover:text-blue-100"
                      onClick={() => setInfoTopicId("")}
                    >
                      Close
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-blue-900 dark:text-blue-100">
                    {topicInfoById[selectedInfoTopic.id]?.overview}
                  </div>
                  <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                    Typical help: {topicInfoById[selectedInfoTopic.id]?.typicalHelp}
                  </div>
                  <div className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                    Suggested appointment length: {topicInfoById[selectedInfoTopic.id]?.suggestedDuration}
                  </div>
                  <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                    Viewing details does not change your selected topic.
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        ) : null}

        {step === "branch" ? (
          <Card>
            <div className={section}>
              <div>
                <div className={h2}>2. Choose a branch</div>
                <div className={muted}>
                  Showing branches available for: <span className="font-semibold text-slate-800 dark:text-slate-100">{selectedTopic?.name}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 dark:text-slate-300">
                    Click any service icon to see details without leaving this step.
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => setShowAllBranches((current) => !current)}
                  >
                    {showAllBranches ? "Show compatible only" : "Show all branches"}
                  </button>
                </div>
              </div>

              <div className={grid2}>
                {visibleBranches.map((b) => {
                  const supportsSelectedTopic = b.topicIds.includes(topicId);
                  const isDisabled = !supportsSelectedTopic;
                  return (
                  <div
                    key={b.id}
                    className={`${getTileStyle(b.id === branchId)} ${isDisabled ? "opacity-70" : ""}`}
                    role="button"
                    tabIndex={isDisabled ? -1 : 0}
                    aria-disabled={isDisabled}
                    onClick={() => {
                      if (isDisabled) return;
                      setBranchId(b.id);
                      setSlotId("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        if (isDisabled) return;
                        setBranchId(b.id);
                        setSlotId("");
                      }
                    }}
                  >
                     <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        📍
                     </div>
                    <div className={`font-semibold ${b.id === branchId ? "text-blue-700 dark:text-blue-300" : "text-slate-900 dark:text-slate-100"}`}>
                      {b.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-300">123 Market St • 0.8 mi</div>
                    {!supportsSelectedTopic ? (
                      <div className="text-xs font-medium text-amber-700 dark:text-amber-300">
                        Service not available at this branch.
                      </div>
                    ) : null}
                    {/* show icons for services offered */}
                    <div className="mt-1 flex gap-1 text-sm">
                      {b.topicIds.map((tid) => {
                        const t = topics.find((x) => x.id === tid);
                        return t ? (
                          <button
                            key={tid}
                            type="button"
                            title={`Learn about ${t.name}`}
                            aria-label={`Learn about ${t.name}`}
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-md border text-sm transition-colors ${
                              infoTopicId === tid
                                ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/40"
                                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/35"
                            }`}
                            onClick={(event) => {
                              event.stopPropagation();
                              setInfoTopicId((current) => (current === tid ? "" : tid));
                            }}
                          >
                            {t.icon}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                );
                })}
              </div>

              {selectedInfoTopic ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/35">
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-semibold text-blue-900 dark:text-blue-100">
                      {selectedInfoTopic.icon} {selectedInfoTopic.name}
                    </div>
                    <button
                      type="button"
                      className="text-sm font-medium text-blue-700 hover:text-blue-900 dark:text-blue-200 dark:hover:text-blue-100"
                      onClick={() => setInfoTopicId("")}
                    >
                      Close
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-blue-900 dark:text-blue-100">
                    {topicInfoById[selectedInfoTopic.id]?.overview}
                  </div>
                  <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                    Typical help: {topicInfoById[selectedInfoTopic.id]?.typicalHelp}
                  </div>
                  <div className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                    Suggested appointment length: {topicInfoById[selectedInfoTopic.id]?.suggestedDuration}
                  </div>
                  <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                    Your selected appointment topic remains {selectedTopic?.name ?? "unchanged"}.
                  </div>
                </div>
              ) : null}

              {!showAllBranches && availableBranches.length === 0 ? (
                <div className={emptyState}>
                  <div className="text-2xl mb-2">😔</div>
                  No branches support "{selectedTopic?.name}" at this time.
                </div>
              ) : null}
            </div>
          </Card>
        ) : null}

        {step === "time" ? (
          <Card>
            <div className={section}>
              <div>
                <div className={h2}>3. Select a time</div>
                <div className={muted}>
                  At <span className="font-semibold text-slate-800 dark:text-slate-100">{selectedBranch?.name}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Calendar Window: {selectedDateMonthLabel}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-300">
                    Starts from today and updates automatically.
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableDates.map((dateISO) => {
                    const label = DATE_LABEL_FORMATTER.format(fromDateISO(dateISO));
                    const isSelected = selectedDateISO === dateISO;
                    return (
                      <button
                        key={dateISO}
                        type="button"
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-200"
                            : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500"
                        }`}
                        onClick={() => {
                          setSelectedDateISO(dateISO);
                          setSlotId("");
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {availableSlots.length === 0 ? (
                <div className={emptyState}>
                  No appointment times are currently available for this topic and branch combination.
                </div>
              ) : null}

              <div className={grid3}>
                {slotsForSelectedDate.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={getTileStyle(s.id === slotId)}
                    onClick={() => setSlotId(s.id)}
                  >
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{s.timeLabel}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-300">{s.dateLabel}</div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ) : null}

        {step === "details" ? (
          <Card>
            <div className={section}>
              <div>
                <div className={h2}>4. Your details</div>
                <div className={muted}>Where should we send the confirmation?</div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className={label}>Full Name</label>
                  <input 
                    className={`${input} ${showNameError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40" : ""}`}
                    placeholder="e.g. Jane Doe"
                    value={customerName} 
                    autoComplete="name"
                    onChange={(e) => setCustomerName(e.target.value)}
                    onBlur={() => setNameTouched(true)}
                  />
                  {showNameError ? <div className="text-xs text-rose-600 dark:text-rose-300">Please enter your full name.</div> : null}
                </div>

                <div className="flex flex-col gap-2">
                  <label className={label}>Email Address</label>
                  <input
                    type="email"
                    className={`${input} ${showEmailError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500 dark:focus:ring-rose-900/40" : ""}`}
                    placeholder="e.g. jane@example.com"
                    value={customerEmail}
                    autoComplete="email"
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                  />
                  {showEmailError ? <div className="text-xs text-rose-600 dark:text-rose-300">Enter a valid email address.</div> : null}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className={label}>Notes for your banker (optional)</label>
                  <textarea
                    className={`${input} min-h-28 resize-y`}
                    placeholder="Add any context that helps us prepare, such as account type, documents, or questions."
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>
        ) : null}

        {step === "confirm" ? (
          <Card>
            <div className={section}>
              <div className={h2}>5. Review & Confirm</div>
              <div className={muted}>Please double check your appointment details.</div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/35 dark:text-blue-200">
                After you confirm, we will send an email confirmation and generate a simple lookup number.
              </div>

              <div className="rounded-xl bg-slate-50 p-6 border border-slate-100 dark:border-slate-700 dark:bg-slate-800/70">
                <div className="flex flex-col gap-4">
                  <div className={rowBetween}>
                    <div className="text-sm text-slate-500 dark:text-slate-300">Service</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span>{selectedTopic?.icon}</span>
                        {selectedTopic?.name}
                    </div>
                  </div>
                  <div className={divider} />
                  <div className={rowBetween}>
                    <div className="text-sm text-slate-500 dark:text-slate-300">Location</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{selectedBranch?.name}</div>
                  </div>
                  <div className={divider} />
                  <div className={rowBetween}>
                    <div className="text-sm text-slate-500 dark:text-slate-300">Date & Time</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{selectedSlot?.dateLabel} at {selectedSlot?.timeLabel}</div>
                  </div>
                  <div className={divider} />
                  <div className={rowBetween}>
                    <div className="text-sm text-slate-500 dark:text-slate-300">Contact</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100 text-right">
                      {customerName}<br/><span className="text-slate-500 dark:text-slate-300 font-normal">{customerEmail}</span>
                    </div>
                  </div>
                  {appointmentNotes.trim().length > 0 ? (
                    <>
                      <div className={divider} />
                      <div className={rowBetween}>
                        <div className="text-sm text-slate-500 dark:text-slate-300">Notes</div>
                        <div className="font-medium text-slate-900 dark:text-slate-100 text-right max-w-[70%] break-words">
                          {appointmentNotes.trim()}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4">
                <button
                  type="button"
                  className={`${button} ${buttonGhost}`}
                  onClick={goBack}
                  disabled={isSubmitting}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className={`${button} ${buttonPrimary} w-full md:w-auto`}
                  onClick={submitMock}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Booking..." : "Confirm Appointment"}
                </button>
              </div>
            </div>
          </Card>
        ) : null}

        {/* Navigation Buttons (Bottom) */}
        {step !== "confirm" && (
          <div className="flex items-center justify-between pt-4">
             {step !== "topic" ? (
               <button type="button" className={`${button} ${buttonGhost}`} onClick={goBack}>
                 ← Back
               </button>
             ) : <div />} {/* Spacer */}

            <button
              type="button"
              className={`${button} ${buttonPrimary}`}
              onClick={goNext}
              disabled={!canNext}
            >
              Next Step →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentCreate;