import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Stepper from "../components/ui/Stepper";
import { page, stack, section, grid2, rowBetween, grid3 } from "../styles/layout";
// FIXED: added 'emptyState' to imports
import { button, buttonPrimary, buttonGhost, divider, h2, input, label, muted, emptyState } from "../styles/ui";

// use shared appointment state
import { useAppointments } from "../state/appointments";

type Topic = { id: string; name: string; icon: string };
type Branch = { id: string; name: string; topicIds: string[]; slotIds: string[] };
// slots are global and booked state is derived from appointments
type Slot = { id: string; dateLabel: string; timeLabel: string };

// ADDED: More options (Investments, Notary)
const topics: Topic[] = [
  { id: "t1", name: "Open a new account", icon: "✨" },
  { id: "t2", name: "Credit card support", icon: "💳" },
  { id: "t3", name: "Loan consultation", icon: "🏠" },
  { id: "t4", name: "Wealth Management", icon: "📈" },
  { id: "t5", name: "Notary Services", icon: "✒️" }
];

// ADDED: New 'North Branch'
const branches: Branch[] = [
  { id: "b1", name: "Downtown Branch", topicIds: ["t1", "t2", "t3", "t4"], slotIds: ["s1", "s3", "s4", "s5"] },
  { id: "b2", name: "Westside Branch", topicIds: ["t2", "t3", "t5"], slotIds: ["s2", "s6"] },
  { id: "b3", name: "Eastside Branch", topicIds: ["t1", "t4", "t5"], slotIds: ["s7", "s8"] },
  { id: "b4", name: "North Hills (HQ)", topicIds: ["t1", "t2", "t3", "t4", "t5"], slotIds: ["s1","s2","s3","s4","s5","s6","s7","s8"] },
];

// ADDED: More time slots (the branch-specific availability is tracked in branch.slotIds)
const allSlots: Slot[] = [
  { id: "s1", dateLabel: "Fri, Feb 20", timeLabel: "9:00 AM" },
  { id: "s2", dateLabel: "Fri, Feb 20", timeLabel: "9:30 AM" },
  { id: "s3", dateLabel: "Fri, Feb 20", timeLabel: "10:00 AM" },
  { id: "s4", dateLabel: "Fri, Feb 20", timeLabel: "10:30 AM" },
  { id: "s5", dateLabel: "Fri, Feb 20", timeLabel: "11:00 AM" },
  { id: "s6", dateLabel: "Fri, Feb 20", timeLabel: "2:00 PM" },
  { id: "s7", dateLabel: "Sat, Feb 21", timeLabel: "10:00 AM" },
  { id: "s8", dateLabel: "Sat, Feb 21", timeLabel: "11:00 AM" },
];

type StepId = "topic" | "branch" | "time" | "details" | "confirm";

function AppointmentCreate() {
  const navigate = useNavigate();

  const steps = ["Topic", "Branch", "Time", "Details", "Confirm"];
  const [step, setStep] = useState<StepId>("topic");

  const [topicId, setTopicId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [slotId, setSlotId] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const { appointments, addAppointment } = useAppointments();

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

  const selectedBranch = useMemo(() => branches.find((b) => b.id === branchId) ?? null, [branchId]);

  // compute what slots are actually available by checking branch and booked appointments
  const availableSlots = useMemo(() => {
    const bookedIds = new Set(appointments.map((a) => a.slotId));
    let slots = allSlots;
    if (selectedBranch) {
      slots = slots.filter((s) => selectedBranch.slotIds.includes(s.id));
    }
    return slots.filter((s) => !bookedIds.has(s.id));
  }, [appointments, selectedBranch]);
  const selectedSlot = useMemo(() => allSlots.find((s) => s.id === slotId) ?? null, [slotId]);

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
    (step === "branch" && !!branchId) ||
    (step === "time" && !!slotId) ||
    (step === "details" && customerName.trim().length > 0 && customerEmail.trim().length > 0) ||
    step === "confirm";

  function submitMock() {
    if (!selectedTopic || !selectedBranch || !selectedSlot) return;
    const newAppt = addAppointment({
      topicId: selectedTopic.id,
      topicName: selectedTopic.name,
      topicIcon: selectedTopic.icon,
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      slotId: selectedSlot.id,
      dateLabel: selectedSlot.dateLabel,
      timeLabel: selectedSlot.timeLabel,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
    });

    // reset form just in case user returns
    setTopicId("");
    setBranchId("");
    setSlotId("");
    setCustomerName("");
    setCustomerEmail("");

    navigate(`/appointments/${newAppt.id}`);
  }

  // Tile styling helper
  const getTileStyle = (isSelected: boolean) =>
    `flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${
      isSelected
        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-offset-2 shadow-md"
        : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg hover:-translate-y-1"
    }`;

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Book an Appointment"
          subtitle="Follow the steps below to schedule a meeting with our banking specialists."
          right={
            <Link to="/appointments" className={buttonGhost}>
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
                <div className={muted}>Select a topic so we can find the right specialist for you.</div>
              </div>

              <div className={grid2}>
                {topics.map((t) => {
                  const branchSupports =
                    selectedBranch && selectedBranch.topicIds.includes(t.id);
                  const disabled = Boolean(selectedBranch && !branchSupports);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={getTileStyle(t.id === topicId)}
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) return;
                        setTopicId(t.id);
                        setBranchId("");
                        setSlotId("");
                      }}
                    >
                      <div className="text-2xl">{t.icon}</div>
                      <div
                        className={`font-semibold ${
                          t.id === topicId
                            ? "text-blue-700"
                            : disabled
                            ? "text-slate-400"
                            : "text-slate-900"
                        }`}
                      >
                        {t.name}
                      </div>
                      {disabled ? (
                        <div className="text-xs text-red-500 mt-1">Not available here</div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        ) : null}

        {step === "branch" ? (
          <Card>
            <div className={section}>
              <div>
                <div className={h2}>2. Choose a branch</div>
                <div className={muted}>
                  Showing branches available for: <span className="font-semibold text-slate-800">{selectedTopic?.name}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Icons under each branch indicate the services it supports. Other services are not offered here.
                </div>
              </div>

              <div className={grid2}>
                {availableBranches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={getTileStyle(b.id === branchId)}
                    onClick={() => {
                      setBranchId(b.id);
                      setSlotId("");
                    }}
                  >
                     <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        📍
                     </div>
                    <div className={`font-semibold ${b.id === branchId ? "text-blue-700" : "text-slate-900"}`}>
                      {b.name}
                    </div>
                    <div className="text-xs text-slate-500">123 Market St • 0.8 mi</div>
                    {/* show icons for services offered */}
                    <div className="mt-1 flex gap-1 text-sm">
                      {b.topicIds.map((tid) => {
                        const t = topics.find((x) => x.id === tid);
                        return t ? (
                          <span key={tid} title={t.name} className="opacity-80">
                            {t.icon}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </button>
                ))}
              </div>

              {availableBranches.length === 0 ? (
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
                  At <span className="font-semibold text-slate-800">{selectedBranch?.name}</span>
                </div>
              </div>

              <div className={grid3}>
                {availableSlots.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={getTileStyle(s.id === slotId)}
                    onClick={() => setSlotId(s.id)}
                  >
                    <div className="font-semibold text-slate-900">{s.timeLabel}</div>
                    <div className="text-sm text-slate-500">{s.dateLabel}</div>
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
                    className={input} 
                    placeholder="e.g. Jane Doe"
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)} 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={label}>Email Address</label>
                  <input
                    className={input}
                    placeholder="e.g. jane@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
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

              <div className="rounded-xl bg-slate-50 p-6 border border-slate-100">
                <div className="flex flex-col gap-4">
                  <div className={rowBetween}>
                    <div className="text-sm text-slate-500">Service</div>
                    <div className="font-medium text-slate-900 flex items-center gap-2">
                        <span>{selectedTopic?.icon}</span>
                        {selectedTopic?.name}
                    </div>
                  </div>
                  <div className={divider} />
                  <div className={rowBetween}>
                    <div className="text-sm text-slate-500">Location</div>
                    <div className="font-medium text-slate-900">{selectedBranch?.name}</div>
                  </div>
                  <div className={divider} />
                  <div className={rowBetween}>
                    <div className="text-sm text-slate-500">Date & Time</div>
                    <div className="font-medium text-slate-900">{selectedSlot?.dateLabel} at {selectedSlot?.timeLabel}</div>
                  </div>
                  <div className={divider} />
                  <div className={rowBetween}>
                    <div className="text-sm text-slate-500">Contact</div>
                    <div className="font-medium text-slate-900 text-right">
                      {customerName}<br/><span className="text-slate-500 font-normal">{customerEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" className={`${button} ${buttonPrimary} w-full md:w-auto`} onClick={submitMock}>
                  Confirm Appointment
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